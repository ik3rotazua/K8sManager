using es.efor.Auth.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Policies.Menu;
using System.ComponentModel;

namespace es.kubenet.K8sManager.Auth.Authorization.Policies.Enums
{
  [Description("Gestión de roles")]
  public enum RoleManagementPolicies
  {
    /// <summary>
    /// Visualización de detalles de rol
    /// </summary>
    [Description("Ver detalles")]
    [PolicyRequiredClaims("app-claim-" + nameof(RoleManagementPolicies), nameof(RoleManagementDetailView))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    RoleManagementDetailView,

    /// <summary>
    /// Creación de nuevo rol
    /// </summary>
    [Description("Crear nuevo rol")]
    [PolicyRequiredClaims("app-claim-" + nameof(RoleManagementPolicies), nameof(RolManagementCreate))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    RolManagementCreate,

    /// <summary>
    /// Edición de rol existente
    /// </summary>
    [Description("Editar rol existente")]
    [PolicyRequiredClaims("app-claim-" + nameof(RoleManagementPolicies), nameof(RolManagementEdit))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    RolManagementEdit,

    /// <summary>
    /// Eliminación de rol existente
    /// </summary>
    [Description("Eliminar rol existente")]
    [PolicyRequiredClaims("app-claim-" + nameof(RoleManagementPolicies), nameof(RolManagementDelete))]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAdministration)]
    [PolicyMenuItem(PolicyMenu.PolicyMenuAll)]
    RolManagementDelete,
  }
}
