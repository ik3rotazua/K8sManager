using Azure.Core;
using es.kubenet.K8sManager.Auth.Extensions;
using es.kubenet.K8sManager.Auth.Models;
using es.kubenet.K8sManager.Business.Accounts.Extensions;
using es.kubenet.K8sManager.Business.Core.Extensions;
using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Database;
using es.kubenet.K8sManager.Database.Models.Constants;
using es.kubenet.K8sManager.Infraestructure.Mappers.Extensions;
using es.kubenet.K8sManager.MainGateway.Controllers;
using es.kubenet.K8sManager.MainGateway.Models.Configs;
using es.efor.Utilities.Swagger.Extensions;
using es.efor.Utilities.Web;
using es.efor.Utilities.Web.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using StackExchange.Profiling.Storage;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace es.kubenet.K8sManager.MainGateway
{
  public class Startup
  {
    private readonly Guid INSTANCE_ID;
    private readonly string INSTANCE_HOSTNAME;
    private readonly IConfiguration Configuration;
    private readonly IWebHostEnvironment CurrentEnvironment;

    public Startup(
        IConfiguration configuration,
        IWebHostEnvironment webHostEnvironment,
        Guid appInstanceId,
        string appHostName)
    {
      Configuration = configuration;
      CurrentEnvironment = webHostEnvironment;
      INSTANCE_ID = appInstanceId;
      INSTANCE_HOSTNAME = appHostName;
    }


    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      var tStartup = typeof(Startup);

      #region CORS
      var corsPolicies = new Dictionary<string, CorsPolicySettings>();
      Configuration.GetSection("Cors").Bind(corsPolicies);
      if (corsPolicies?.Any() ?? false)
      {
        services.AddCors(options =>
        {
          foreach (var corsPolicy in corsPolicies)
          {
            if (string.IsNullOrWhiteSpace(corsPolicy.Key))
            {
              throw new Exception("Las pol�ticas de CORS deben tener las claves bien definidas.");
            }

            options.AddPolicy(
                        name: corsPolicy.Key,
                        policy =>
                        {
                          if (corsPolicy.Value?.Origins == null || !corsPolicy.Value.Origins.Any())
                          {
                            throw new Exception($"CORS [{corsPolicy.Key}]: No se han definido or�genes para la pol�tica.");
                          }

                          var pol = policy.WithOrigins(corsPolicy.Value.Origins);
                          if (corsPolicy.Value.Headers?.Any() ?? false)
                          {
                            pol.WithHeaders(corsPolicy.Value.Headers);
                          }
                          else
                          {
                            pol.AllowAnyHeader();
                          }

                          if (corsPolicy.Value.Methods?.Any() ?? false)
                          {
                            pol.WithMethods(corsPolicy.Value.Methods);
                          }
                          else
                          {
                            pol.AllowAnyMethod();
                          }

                          if (corsPolicy.Value.AllowCredentials)
                          {
                            pol.AllowCredentials();
                          }
                          else
                          {
                            pol.DisallowCredentials();
                          }
                        });
          }
        });
      }
      #endregion

      #region Binded Configs Singletons
      var authConfig = new LoginModeSettings();
      Configuration
          .GetSection("LoginModes")
          .Bind(authConfig);
      LoginModeSettings.EnsureSettings(authConfig);
      services.AddSingleton(authConfig);
      #endregion


      services.AddDatabaseContext(Configuration);
      // // Add project-related services here
      // services.AddXXXXService();
      services.AddProjectCoreServices();

      // DataProtection by shared db context
      services.AddDataProtection()
          .PersistKeysToDbContext<AppDbContext>();
      services.AddProjectAccountsServices();
      services.AddProjectAuth(Configuration);

      #region Mini Profiler
      services.AddMiniProfiler(options =>
      {
        options.RouteBasePath = "/api/_profiler";

        // STORAGE
        // // STORAGE - SQL SERVER (requires seed / migration)
        //options.Storage = new SqlServerStorage(Configuration.GetConnectionString("Default"));
        // STORAGE - MEMORY CACHE (RAM usage)
        var storage = (options.Storage as MemoryCacheStorage);
        if (storage == null) {
          throw new ArgumentNullException(nameof(storage), "Cache storage is not available. Did you ment to use another storage?");
        }
        
        storage.CacheDuration = TimeSpan.FromMinutes(60);

        // ROUTES
        var excludedControllers = new string[]
        {
          nameof(AccountController),
          nameof(LayoutMenuController),
          nameof(MiniProfilerController),
          nameof(LanguageController),
        }.Select(ctrl => ctrl.Replace("Controller", ""));
        options.ShouldProfile = request =>
        {
          if (!request.Path.StartsWithSegments("/api")) { return false; }
          return !excludedControllers.Contains(request.RouteValues.GetValueOrDefault("controller")?.ToString() ?? string.Empty);
        };
        // STYLES
        options.SqlFormatter = new StackExchange.Profiling.SqlFormatters.SqlServerFormatter();
        options.ColorScheme = StackExchange.Profiling.ColorScheme.Auto;

        // AUTHORIZATION
        options.ResultsAuthorize = request => request.HttpContext.User?.Identity?.IsAuthenticated ?? false
          && request.HttpContext.User.IsInRole(RoleNames.ROLE_ADMIN);
        options.ResultsListAuthorize = request => request.HttpContext.User?.Identity?.IsAuthenticated ?? false
          && request.HttpContext.User.IsInRole(RoleNames.ROLE_ADMIN);

        // AUTHENTICATION
        options.UserIdProvider = request => request.HttpContext.User.GetClaimUserName() ?? "< Unauthenticated >";
        //options.UserIdProvider = request => request.HttpContext.User.GetClaimId();

        options.ShowControls = true;
      });
      #endregion

      services.AddEntityMapper();

      services.AddControllers()
        .AddNewtonsoftJson(o =>
        {
          o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
          o.SerializerSettings.Converters.Add(new StringEnumConverter());
        });

      services.AddEforSwagger<Program>(Configuration);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(
        IApplicationBuilder app,
        ILogger logger,
        IConfiguration config)
    {
      var watch = Stopwatch.StartNew();
      logger.LogInformation("Services configured. Starting app...");

      var applySeed = true;
      var isPipeline = config.GetValue(
          ConsoleArgs.CONSOLE_ARG_IS_PIPELINE,
          config.GetValue(
              $"--{ConsoleArgs.CONSOLE_ARG_IS_PIPELINE}",
              false));

      // Determina si se debe preguntar al usuario si se desean aplicar migraciones pendientes.
      // De ser "false", se aplican de forma autom�tica
      var askPendingMigrations = config.GetValue(
          ConsoleArgs.CONSOLE_ARG_ASK_PENDING_MIGRATIONS,
          config.GetValue(
              $"--{ConsoleArgs.CONSOLE_ARG_ASK_PENDING_MIGRATIONS}",
              true));

      // Solo se detiene la aplicaci�n si es pipeline y se debe confirmar la ejecuci�n de las migraciones
      // por parte del usuario
      var stopIfPendingMigrations = isPipeline && askPendingMigrations;


      app.ApplyDbContextMigrations(
          applySeeding: applySeed,
          stopIfPendingMigrations: stopIfPendingMigrations,
          askConfirmPendingMigrations: askPendingMigrations
          );

      if (CurrentEnvironment.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.Use((context, next) =>
      {
        context.Response.Headers["KUB-H"] = INSTANCE_HOSTNAME;
        try
        {
          var t = next.Invoke();
          return t;
        }
        catch (Exception)
        {
          throw;
        }
      });

      app.UseEforSwagger(Configuration);
      app.UseForwardedHeaders();

      app.UseHttpsRedirection();

      //app.UseCors();

      var provider = new FileExtensionContentTypeProvider();
      provider.Mappings[".webmanifest"] = "application/manifest+json";

      var useStaticFiles = CurrentEnvironment.WebRootPath != null;
      if (useStaticFiles)
      {
        app.UseDefaultFiles();
        app.UseStaticFiles(new StaticFileOptions()
        {
          ContentTypeProvider = provider,
        });
      }

      app.UseEforTaskCanceledExceptionHandlers();
      app.UseEforValidationExceptionHandlers();
      app.UseRouting();

      var corsPolicies = new Dictionary<string, CorsPolicySettings>();
      Configuration.GetSection("Cors").Bind(corsPolicies);
      logger.LogInformation(
          "CORS: [{corsQty}] pol�ticas definidas.",
          (corsPolicies?.Count ?? 0)
          );

      if (corsPolicies?.Any() ?? false)
      {
        foreach (var corsPolicy in corsPolicies)
        {
          if (string.IsNullOrWhiteSpace(corsPolicy.Key))
          {
            throw new Exception("Las pol�ticas de CORS deben tener las claves bien definidas.");
          }

          logger.LogInformation(
              "CORS [{corsPolName}]: {corsPolicy}",
              corsPolicy.Key,
              JsonConvert.SerializeObject(corsPolicy.Value)
              );
          app.UseCors(corsPolicy.Key);
        }
      }

      //// Need to log Swagger requests? Move this before UseAppSwagger();
      //// Need to log StaticFile requests? Move this before UseDefaultFiles & UseStaticFiles();
      //// Need to log ONLY Api Controller & Actions? Move this between UseRouting & UseEndpoints
      //app.UseEforSerilog();

      #region AUTHENTICATION
      //// With ASP.NETCore Identity - Only User
      //// 1 - Identity the client's session
      //app.UseAuthentication();
      //// 2 - User-refreshing related middleware
      ////     Client needs to be identified as user or anonymous
      //app.UseMiddleware<ClaimRefreshMiddleware<Guid, AppUser, AppIdentitySignInManager, AppIdentityUserManager, AppRole>>();
      //// 3 - Client related authorization
      //app.UseAuthorization();

      // With ASP.NETCore Identity
      app.UseAuthentication();
      app.UseAuthorization();
      //app.UseEforIdentityAuthentication<
      //    Guid, AppUser, AppRole,
      //    AppIdentitySignInManager, AppIdentityUserManager,
      //    AccountController, AccessController>();
      #endregion
      //// Without ASP.NETCore Identity
      //app.UseEforSimpleAuthentication<Controllers.AccountController, Controllers.AccessController>();


      app.UseMiniProfiler();
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });

      if (useStaticFiles)
      {
        app.UseEforAngular();
      }

      watch.Stop();
      logger.LogInformation("Application started. Ellapsed: [{elapsed}]", watch.Elapsed);
    }
  }
}