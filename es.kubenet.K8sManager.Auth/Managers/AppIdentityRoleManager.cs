using es.efor.Auth.Managers;
using es.kubenet.K8sManager.Auth.Extensions;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Auth.Managers
{
  public class AppIdentityRoleManager : IdentityRoleManager<Guid, AppRole>
  {
    public AppIdentityRoleManager(
        IRoleStore<AppRole> store,
        IEnumerable<IRoleValidator<AppRole>> roleValidators,
        ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors,
        ILogger<AppIdentityRoleManager> logger)
        : base(store, roleValidators, keyNormalizer, errors, logger)
    {

    }

    public override async Task<IList<Claim>> GetClaimsAsync(AppRole role)
    {
      var claims = (await base.GetClaimsAsync(role))
          .UniqueOnly();
      return claims;
    }
    public override async Task<IList<Claim>> GetClaimsAsync(Guid roleId)
    {
      var claims = (await base.GetClaimsAsync(roleId))
          .UniqueOnly();
      return claims;
    }
  }
}
