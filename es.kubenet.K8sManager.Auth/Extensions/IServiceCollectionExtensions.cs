using es.efor.Auth.Extensions;
using es.efor.Auth.Models.Configs;
using es.kubenet.K8sManager.Auth.Managers;
using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using es.efor.Utilities.General;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace es.kubenet.K8sManager.Auth.Extensions
{
  public static class IServiceCollectionExtensions
  {
    private const string JwtSecret = "0lZTuC1DSwP2*cQR?cF1F.VGkfsBly8xkcWXR2+lZKVR#5C66mf5?VhadT5F9FLQwvWXXHvMv_xdjr#BLzG8.5FUxOn9?2FFCG_a0bR";
    private static readonly string JwtIssuer = typeof(IServiceCollectionExtensions).Namespace ?? throw new Exception("Namespace metadata missing");

    public static IServiceCollection AddProjectAuth(this IServiceCollection services, IConfiguration configuration)
    {
      var projectPolicies = Authorization.Policies.AppIdentityPolicies.GetAllPolicyClaims()
              .SelectMany(d => d.Value).ToList();
      var policyAndClaims = projectPolicies
          .Select(p => new { p.Policy, p.Claims })
          .ToDictionary(p => p.Policy, p => p.Claims);
      var policyMenuSections = EnumHelper.GetEnumValues<Authorization.Policies.Menu.PolicyMenu>()
          .Select(m => m.ToString());
      //// Not needed if using AddEforIdentityAuthentication
      //services.AddAppAuthorizationPolicies(policyAndClaims, policyMenuSections);

      //// Without ASPNETCore Identity.
      //// Cookies only.
      //services.AddEforSimpleAuthentication(new IdentityConfiguration()
      //    .UseCookies());

      //// Without ASPNETCore Identity.
      //// Bearer JWT only.
      //services.AddEforSimpleAuthentication(
      //    new IdentityConfiguration()
      //        .UseJsonWebTokens(JwtSecret, JwtIssuer),
      //    policyAndClaims: policyAndClaims,
      //    policyMenuSections: policyMenuSections);

      // Without ASPNETCore Identity.
      // Bearer JWT and Cookies. Bearer JWT is the default one.
      //services.AddEforSimpleAuthentication(new IdentityConfiguration()
      //    .UseCookies()
      //    .UseJsonWebTokens(JwtSecret, JwtIssuer),
      //    "Bearer", "Bearer");

      // With ASPNETCore Identity
      services.AddEforIdentityAuthentication<
          AppDbContext, Guid, AppUser, AppRole,
          AppIdentitySignInManager, AppIdentityUserManager, AppIdentityRoleManager>(
              new IdentityConfiguration().UseCookies(),
              policyAndClaims: policyAndClaims,
              policyMenuSections: policyMenuSections
          );

      // // With ASPNETCore Identity.
      // Bearer JWT and Cookies. Bearer JWT is the default one.
      //services.AddEforIdentityAuthentication<
      //    NexusContext, Guid, User, Role,
      //    IdentitySignInManager<Guid, User>,
      //    IdentityUserManager<Guid, User>,
      //    IdentityRoleManager<Guid, Role>>
      //    (new IdentityConfiguration()
      //        // Using both Cookies and JWT is possible, but "Authorize" attribute
      //        // will be required in the methods/controllers where user data is required.
      //        // If using both and also using [Authorize], be sure to specify
      //        .UseCookies() // This configures Identity to use Cookie authentication
      //        .UseJsonWebTokens(JwtSecret, JwtIssuer), // This configures Identity to use Json Web Token authentication (Bearer)
      //        "Bearer", "Bearer");


      //services.AddProjectAuthorizationPolicies();
      return services;
    }
  }
}
