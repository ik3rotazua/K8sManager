using es.efor.Auth.Managers;
using es.kubenet.K8sManager.Auth.Extensions;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Auth.Managers
{
  public class AppIdentityUserManager : IdentityUserManager<Guid, AppUser>
  {
    public AppIdentityUserManager(
        IUserStore<AppUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<AppUser> passwordHasher,
        IEnumerable<IUserValidator<AppUser>> userValidators, IEnumerable<IPasswordValidator<AppUser>> passwordValidators,
        ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<AppIdentityUserManager> logger)
        : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
    {

    }

    public async Task<IList<Claim>> GetClaimsAsync(Guid userId)
    {
      var user = await FindByIdAsync(userId).ConfigureAwait(false);
      return await GetClaimsAsync(user).ConfigureAwait(false);
    }
    public override async Task<IList<Claim>> GetClaimsAsync(AppUser user)
    {
      return (await base.GetClaimsAsync(user).ConfigureAwait(false))
          .UniqueOnly();
    }
  }
}
