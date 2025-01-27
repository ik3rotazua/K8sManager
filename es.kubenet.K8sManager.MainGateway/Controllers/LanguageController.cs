using es.kubenet.K8sManager.Infraestructure.Dto.Languages;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace es.kubenet.K8sManager.MainGateway.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class LanguageController : ControllerBase
  {
    [HttpGet]
    public ActionResult<IEnumerable<LanguageDTO>> Get()
    {
      var asView = new List<LanguageDTO>();
      return asView;
    }
  }
}
