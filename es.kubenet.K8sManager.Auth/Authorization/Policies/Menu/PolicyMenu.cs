using System.ComponentModel;

namespace es.kubenet.K8sManager.Auth.Authorization.Policies.Menu
{
  // Name of the enum must match es.efor.Auth.Extensions.IServiceCollectionExtensions.MENU_POLICY_ENUM_NAME
  public enum PolicyMenu
  {
    [Description("All")]
    PolicyMenuAll,
    [Description("Administration")]
    PolicyMenuAdministration
  }
}
