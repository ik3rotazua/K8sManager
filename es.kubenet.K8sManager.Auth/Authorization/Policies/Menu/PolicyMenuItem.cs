using es.efor.Utilities.General;
using es.efor.Utilities.Web.Identity.Authorization.Policies.Models;
using System.Collections.Generic;

namespace es.kubenet.K8sManager.Auth.Authorization.Policies.Menu
{
  public class PolicyMenuItem
  {
    public PolicyMenu MenuItem { get; set; }
    public string Description => MenuItem.GetDescription();
    public List<PolicySectionModelView> Sections { get; set; }

    public PolicyMenuItem()
    {
      Sections = new List<PolicySectionModelView>();
    }
  }
}
