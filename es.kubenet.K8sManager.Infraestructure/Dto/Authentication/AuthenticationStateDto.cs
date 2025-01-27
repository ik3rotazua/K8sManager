using es.efor.Utilities.Web.Models.Identity;

namespace es.kubenet.K8sManager.Infraestructure.Dto.Authentication
{
  public class AuthenticationStateDto : AuthenticationState
  {
    public string? DisplayName { get; set; }
  }
}
