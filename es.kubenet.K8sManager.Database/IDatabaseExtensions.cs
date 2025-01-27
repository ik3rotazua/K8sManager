using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Database.Models.Constants;
using es.kubenet.K8sManager.Utilities.ConsoleUtilities.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;

namespace es.kubenet.K8sManager.Database
{
  public static class IDatabaseExtensions
  {
    internal static IEnumerable<string> PendingMigrations = [];
    private const ConsoleKey CONSOLE_KEY_YES = ConsoleKey.S;
    private const ConsoleKey CONSOLE_KEY_NO = ConsoleKey.N;
    private static IEnumerable<ConsoleKey> CONSOLE_CONFIRM_KEYS = [CONSOLE_KEY_YES, CONSOLE_KEY_NO];


    #region AddDatabaseContext
    public static IServiceCollection AddDatabaseContext(this IServiceCollection services, IConfiguration configuration)
    {
      var connString = configuration.GetConnectionString("Default")
        ?? throw new ArgumentNullException("ConnectionString::Default");
      var dbVersion = configuration.GetSection("Database").GetValue<string>("DbVersion");
      return services.AddDatabaseContext(connString, dbVersion);
    }
    public static IServiceCollection AddDatabaseContext(this IServiceCollection services, string connectionString, string? dbVersion = null)
    {
      return services.AddDatabaseContext((svProvider, options) =>
      {
        options.UseSqlServer(connectionString, o =>
              {

              });
      });
    }
    public static IServiceCollection AddDatabaseContext(this IServiceCollection services,
        Action<IServiceProvider, DbContextOptionsBuilder> options,
        ServiceLifetime contextLifetime = ServiceLifetime.Scoped,
        ServiceLifetime optionsLifetime = ServiceLifetime.Scoped)
    {
      // Used to get information regarding the HttpContext that consumes the SSMContext.
      // This allows us to get information such as the user's Identity when performing
      // database related operations
      services.AddHttpContextAccessor();
      services.AddDbContext<AppDbContext>((dbSvProvider, dbOpts) =>
      {
        //dbOpts.AddInterceptors(new OracleClientInfoInterceptor(dbSvProvider));
        options(dbSvProvider, dbOpts);
      }, contextLifetime: contextLifetime, optionsLifetime: optionsLifetime);

      return services;
    }
    #endregion


    #region ApplyDbContextMigrations
    /// <summary>
    /// Verifica si existen migraciones de CodeFirst pendientes de ser aplicadas en el contexto de la BDD.
    /// Las aplicará si los parámetros determinan que debe hacerlo.
    /// </summary>
    /// <param name="applySeeding">
    /// Especifica si se debe comprobar el seeding de datos tras terminar el proceso de comprobación
    /// de las migraciones.
    /// </param>
    /// <param name="stopIfPendingMigrations">
    /// Detiene la ejecución de la aplicación si existen migraciones sin aplicar.
    /// </param>
    /// <param name="askConfirmPendingMigrations">
    /// Especifica si se debe solicitar la confirmación del usuario por entrada de consola cuando existen
    /// migraciones que no se han llevado a cabo.
    /// No se tiene en cuenta si <paramref name="stopIfPendingMigrations"/> es <see cref="true"/>.
    /// </param>
    public static IApplicationBuilder ApplyDbContextMigrations(
        this IApplicationBuilder appBuilder,
        bool applySeeding = true,
        bool stopIfPendingMigrations = false,
        bool askConfirmPendingMigrations = true)
    {
      var serviceScope = appBuilder.ApplicationServices.CreateScope();
      var serviceProvider = serviceScope.ServiceProvider;

      var appLifetime = serviceProvider.GetRequiredService<IHostApplicationLifetime>();
      var logger = serviceProvider.GetRequiredService<ILogger<AppDbContext>>();
      var db = serviceProvider.GetRequiredService<AppDbContext>();
      var env = serviceProvider.GetRequiredService<IHostEnvironment>();

      PendingMigrations = db.Database.GetPendingMigrations().ToList();
      var migrationsDone = db.Database.GetAppliedMigrations().ToList();
      logger.LogInformation($"[{migrationsDone.Count()} / {(migrationsDone.Count() + PendingMigrations.Count())}] Migrations applied.");

      if (PendingMigrations.Any())
      {
        System.Threading.Thread.Sleep(TimeSpan.FromSeconds(1)); // Allow the logger to flush its messages.
        Console.WriteLine("");
        var conStr = new DbConnectionStringBuilder();
        conStr.ConnectionString = db.Database.GetConnectionString();
        if (conStr.ContainsKey("Password"))
        {
          conStr.Add("Password", "***");
        }
        Console.WriteLine($"Conexión: {conStr.ConnectionString}");

        if (!env.IsDevelopment() && conStr.ContainsKey("TrustServerCertificate"))
        {
          var value = (conStr["TrustServerCertificate"])?.ToString();
          if (value != null && value.Equals(true.ToString(), StringComparison.OrdinalIgnoreCase))
          {
            throw new Exception("Se ha detectado TrustServerCertificate en la cadena de conexión.\n" +
                "El valor de true solo es admisible en entornos de desarrollo: la conexión debe estar protegida.");
          }
        }

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("Migraciones aplicadas:");
        var lastMigrations = migrationsDone
            .TakeLast(10)
            .ToList();
        if (migrationsDone.Count > lastMigrations.Count)
        {
          Console.WriteLine($"- ([{migrationsDone.Count - lastMigrations.Count}] más)");
        }
        foreach (var m in lastMigrations)
        {
          Console.WriteLine($"- {m}");
        }
        Console.ResetColor();

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("Migraciones pendientes:");
        foreach (var m in PendingMigrations)
        {
          Console.WriteLine($"- {m}");
        }
        Console.ResetColor();

        if (stopIfPendingMigrations)
        {
          var msgSb = new StringBuilder();
          msgSb.AppendLine();
          msgSb.AppendLine();
          msgSb.AppendLine("La aplicación se está deteniendo debido a que se han encontrado migraciones pendientes de aplicar.");
          msgSb.AppendLine("Sin ellas la aplicación no puede continuar.");
          msgSb.AppendLine("Verifique que las migraciones pendientes deben ser aplicadas en la conexión especificada anteriormente.");
          msgSb.AppendLine($"Si está ejecutando un proceso de pipeline y desea forzar las migraciones, utilice \"--{ConsoleArgs.CONSOLE_ARG_IS_PIPELINE}=true --{ConsoleArgs.CONSOLE_ARG_IS_PIPELINE}=false\" .");

          appLifetime.StopApplication();
          throw new ExpectedShutdownException(msgSb.ToString());
        }

        Console.WriteLine("");
        ConsoleKey pressedKey = askConfirmPendingMigrations
            ? ConsoleKey.Attention
            : CONSOLE_KEY_YES;

        while (!CONSOLE_CONFIRM_KEYS.Contains(pressedKey))
        {
          Console.WriteLine("");
          Console.Write($"Aplicar migraciones y continuar con la ejecución? Sí ({CONSOLE_KEY_YES}), No ({CONSOLE_KEY_NO}).");
          pressedKey = Console.ReadKey().Key;
          if (pressedKey == CONSOLE_KEY_YES || pressedKey == CONSOLE_KEY_NO) { break; }
        }
        if (pressedKey == CONSOLE_KEY_YES)
        {
          db.Database.Migrate();
          logger.LogInformation($"Las migraciones se han aplicado.");
          if (migrationsDone.Count == 0)
          {
            System.Threading.Thread.Sleep(TimeSpan.FromSeconds(1));
            appBuilder.CheckSeeding(applySeeding);

            appLifetime.StopApplication();
            throw new ExpectedShutdownException($"Deteniendo la aplicación debido a que se trata de una primera instalación.");
          }
        }
        else
        {
          appLifetime.StopApplication();
          throw new ExpectedShutdownException($"Deteniendo la aplicación. No se puede continuar sin aplicar las migraciones.");
        }
      }
      Console.WriteLine("");
      Console.WriteLine("");

      appBuilder.CheckSeeding(applySeeding);

      return appBuilder;
    }

    private static IApplicationBuilder CheckSeeding(
        this IApplicationBuilder appBuilder,
        bool applySeeding)
    {
      if (applySeeding)
      {
        Console.WriteLine("Buscando seed sin aplicar...");
        appBuilder.SeedDbContext();
      }

      return appBuilder;
    }
    #endregion


    #region SeedDbContext
    public static IApplicationBuilder SeedDbContext(this IApplicationBuilder app)
    {
      if (PendingMigrations == null)
      {
        throw new Exception($"{nameof(SeedDbContext)} method has been called, but no {nameof(ApplyDbContextMigrations)} has been called yet." +
            $"Seed is done by checking the pending migrations, so be sure to call {nameof(ApplyDbContextMigrations)} method.");
      }

      var sv = new DbSeeding.DbSeedService(app);
      sv.StartSeeding().ConfigureAwait(false).GetAwaiter().GetResult();

      return app;
    }
    #endregion
  }
}
