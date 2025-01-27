using AutoMapper;
using es.efor.Auth.Controllers;
using es.kubenet.K8sManager.Auth.Managers;
using es.kubenet.K8sManager.Business.Accounts.AccountServices;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using es.kubenet.K8sManager.Infraestructure.Dto.Authentication;
using es.kubenet.K8sManager.MainGateway.Models.Configs;
using es.efor.Utilities.Web.Models.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.MainGateway.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public sealed class AccountController : AccountIdentityController<AppUser, Guid>
  {
    private readonly IAccountService AccountSV;
    private readonly IAuthenticationSchemeProvider AuthSchemeProvider;
    private readonly LoginModeSettings LoginModes;

    public AccountController(IAuthorizationService authService, IMapper mapper,
        AppIdentitySignInManager signInManager,
        AppIdentityUserManager userManager,
        IAccountService accountSV,
        IAuthenticationSchemeProvider authSchemeProvider,
        LoginModeSettings loginModeSettings)
        : base(authService, mapper, signInManager, userManager)
    {
      AccountSV = accountSV;
      AuthSchemeProvider = authSchemeProvider;
      LoginModes = loginModeSettings;
    }

    [HttpGet("auth-modes")]
    public ActionResult<LoginModeSettings> GetAuthModes()
    {
      var dto = LoginModeSettings.GenerateDto(LoginModes);
      return dto;
    }

    #region COOKIES
    /// <inheritdoc cref="AccountSimpleController.LoginAsync(AccountLoginRequest)"/>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    [Consumes("application/json")]
    public override async Task<IActionResult> LoginAsync([FromBody] AccountLoginRequest data)
    {
      var isEnabled = LoginModes?.LocalUserPass?.IsEnabled ?? false;
      if (!isEnabled)
      {
        return Forbid();
      }

      if (!ModelState.IsValid) { return BadRequest(ModelState); }

      var result = await CheckUserPassword(data);

      if (result.Succeeded)
      {
        //var user = await SignInMng.UserManager.FindByNameAsync(data.Username);
        //// With ASPNET Identity:
        //await SignInMng.SignInAsync(user, data.RememberMe);

        // With ASPNET Identity, building identity with base and extra claims.
        var user = await _userManager.FindByNameAsync(data.Username)
            ?? throw new Exception($"User [{data.Username}] could not be found after successful login.");
        var principal = await _signInManager.CreateUserPrincipalAsync(user);

        // Without ASPNETCore identity, only cookie auth:
        //var principal = await GetSimpleSignInClaim(CookieAuthenticationDefaults.AuthenticationScheme, data);
        var extraClaims = await AccountSV.GetExtraClaimsByUserNameAsync(data.Username);

        var appIdentity = new ClaimsIdentity();
        appIdentity.AddClaims(extraClaims);
        principal.AddIdentity(appIdentity);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties()
            {
              AllowRefresh = data.RememberMe,
              IsPersistent = data.RememberMe,
            });

        return NoContent();
      }
      else if (result.IsLockedOut)
      {
        return BadRequest(nameof(data.Password), "API.ERROR.AUTH.STATUS.LOCKED");
      }
      else if (result.IsNotAllowed)
      {
        return BadRequest(nameof(data.Password), "API.ERROR.AUTH.STATUS.LOCKED");
      }

      return BadRequest(nameof(data.Password), "API.ERROR.AUTH.PASS.FAIL");
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [NonAction]
    public override Task<IActionResult> GetMyProfile()
    {
      throw new InvalidOperationException();
    }

    [HttpGet("profile")]
    public async Task<ActionResult<AuthenticationStateDto>> GetMyProjectProfile()
    {
      var result = new AuthenticationStateDto
      {
        IsAnonymous = !(User?.Identity?.IsAuthenticated ?? false),
        Username = User?.Identity?.Name,
        DisplayName = GetUserDisplayName(),
      };

      List<KeyValuePair<string, IEnumerable<Claim>>> source = (await GetProjectAuthClaimsByPolicyEnumName()).Where((KeyValuePair<string, IEnumerable<Claim>> p) => p.Value.All((Claim c) => (User?.Claims ?? []).Any((Claim uc) => uc.Type == c.Type && uc.Value == c.Value))).ToList();
      result.Permissions = source.Select((KeyValuePair<string, IEnumerable<Claim>> p) => p.Key).ToList();
      await Task.CompletedTask;
      return result;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    [Consumes("application/x-www-form-urlencoded")]
    public async Task<IActionResult> LoginFormAsync([FromForm] AccountLoginRequest data)
        => await LoginAsync(data);


    /// <summary>
    /// Only used to map Policies to OpenAPI (Swagger). Response will always be 200.
    /// In order to be able to map the policies on frontend and use their enumeration values,
    /// <see cref="ProducesResponseTypeAttribute"/> should have the anumerations referenced.
    /// </summary>
    [HttpGet("policies")]
    [ProducesResponseType(typeof(IEnumerable<Auth.Authorization.Policies.Menu.PolicyMenu>), 200)]
    [ProducesResponseType(typeof(IEnumerable<Auth.Authorization.Policies.Enums.RoleManagementPolicies>), 201)]
    [ProducesResponseType(typeof(IEnumerable<Auth.Authorization.Policies.Enums.UserManagementPolicies>), 202)]
    public override async Task<IActionResult> GetPolicies()
    {
      await Task.CompletedTask;
      return Ok(new object[] { });
      //return await base.GetPolicies();
    }

    #endregion


    [HttpGet("logout")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public override async Task<IActionResult> LogoutAsync()
    {
      var schemes = await AuthSchemeProvider.GetAllSchemesAsync();
      foreach (var scheme in schemes)
      {
        var isAuthScheme = (await HttpContext.AuthenticateAsync(scheme.Name)).Succeeded;
        if (!isAuthScheme) { continue; }

        await HttpContext.SignOutAsync(scheme.Name);
      }

      await _signInManager.SignOutAsync();
      return NoContent();
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [NonAction]
    private async Task<ClaimsPrincipal> GetSimpleSignInClaim(
        string schema,
        AccountLoginRequest data)
    {
      var user = await _userManager.FindByNameAsync(data.Username);
      if (user?.UserName == null)
      {
        throw new NullReferenceException($"Could not recover user [{data.Username}]'s data");
      }

      var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.GivenName, user.UserName),
                new Claim(ClaimTypes.Name, user.UserName),
            };

      var claimsIdentity = new ClaimsIdentity(claims, schema);
      var principal = new ClaimsPrincipal(claimsIdentity);

      await Task.CompletedTask;
      return principal;
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [NonAction]
    protected override async Task<Microsoft.AspNetCore.Identity.SignInResult> CheckUserPassword(AccountLoginRequest data)
    {
      Microsoft.AspNetCore.Identity.SignInResult result;
      #region ASPNet Identitity
      var user = await _signInManager.UserManager.FindByNameAsync(data.Username);
      //var user = await SignInMng.UserManager.FindByEmailAsync(data.Username);
      if (user == null) return Microsoft.AspNetCore.Identity.SignInResult.Failed;

      result = await _signInManager.CheckPasswordSignInAsync(user, data.Password, false);
      #endregion

      return result;
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [NonAction]
    private string? GetUserDisplayName()
    {
      if (!User.Identity!.IsAuthenticated)
      {
        return null;
      }

      return User.Identity.Name;
    }
  }
}
