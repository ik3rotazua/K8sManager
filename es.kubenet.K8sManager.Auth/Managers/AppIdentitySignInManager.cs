using es.efor.Auth.Managers;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

namespace es.kubenet.K8sManager.Auth.Managers
{
  public class AppIdentitySignInManager : IdentitySignInManager<Guid, AppUser>
  {
    public AppIdentitySignInManager(
        AppIdentityUserManager userManager,
        IHttpContextAccessor contextAccessor,
        IUserClaimsPrincipalFactory<AppUser> claimsFactory,
        IOptions<IdentityOptions> optionsAccessor, ILogger<AppIdentitySignInManager> logger,
        IAuthenticationSchemeProvider schemes, IUserConfirmation<AppUser> confirmation)
        : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
    {

    }
  }
}
