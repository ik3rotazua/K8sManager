using es.efor.Auth.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Policies.Menu;
using System.ComponentModel;

namespace es.kubenet.K8sManager.Auth.Authorization.Policies.Enums
{
  [Description("Gestión de usuarios")]
  public enum UserManagementPolicies
  {
    /// <summary>
    /// Visualización de detalles de usuario
    /// </summary>
    [Description("Ver detalles")]
    [PolicyRequiredClaims("app-claim-" + nameof(UserManagementPolicies), nameof(UserManagementDetailView))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    UserManagementDetailView,

    /// <summary>
    /// Añadir usuarios a aplicación web
    /// </summary>
    [Description("Añadir usuarios a aplicación web")]
    [PolicyRequiredClaims("app-claim-" + nameof(UserManagementPolicies), nameof(UserManagementAdd))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    UserManagementAdd,
    /// <summary>
    /// Editar datos de usuarios de la aplicación web
    /// </summary>
    [Description("Editar datos de usuarios de la aplicación web")]
    [PolicyRequiredClaims("app-claim-" + nameof(UserManagementPolicies), nameof(UserManagementEdit))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    UserManagementEdit,
    /// <summary>
    /// Edición de roles a los que pertenece un usuario
    /// </summary>
    [Description("Editar roles asignados")]
    [PolicyRequiredClaims("app-claim-" + nameof(UserManagementPolicies), nameof(UserManagementRoleEdit))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    UserManagementRoleEdit,
  }
}
