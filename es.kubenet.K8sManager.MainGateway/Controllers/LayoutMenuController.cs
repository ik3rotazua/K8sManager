using AutoMapper;
using es.efor.Utilities.Web.Controllers;
using es.efor.Utilities.Web.Models.Layout;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.MainGateway.Controllers
{
  [Route("api/app/[controller]")]
  [ApiController]
  public class LayoutMenuController : BaseEforController
  {

    public LayoutMenuController(IAuthorizationService authService, IMapper mapper)
        : base(authService, mapper)
    {

    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<LayoutMenuItem>>> GetAsync()
    {
      var menu = new List<LayoutMenuItem>();

      var sectionMain = new LayoutMenuItem() { Label = "MENU.PAGE.HOME", IconPreffix = "fas", IconName = "home" }
          .AddRouterLinkCommand("/dashboard");

      #region Section - Company
      var sectionCompany = new LayoutMenuItem() { Label = "MENU.PAGE.COMPANY.MAIN", IconPreffix = "fas", IconName = "building" };
      if (User?.Identity?.IsAuthenticated ?? false)
      {
        sectionCompany.AddChild(
            new LayoutMenuItem() { Label = "MENU.PAGE.EMPLOYEE.MAIN", IconPreffix = "fas", IconName = "user-tie", }
                .AddRouterLinkCommand("/employee")
            );
      }
      #endregion

      menu.Add(sectionMain);
      if (sectionCompany.HasChildren) menu.Add(sectionCompany);

      // Return "menu" if using async tasks.
      return await Task.FromResult(menu);
    }
  }
}
