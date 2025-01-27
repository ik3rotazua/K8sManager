using es.efor.Auth.Attributes;
using es.efor.Auth.Constants.Claims;
using es.kubenet.K8sManager.Auth.Authorization.Policies.Menu;
using System;

namespace es.kubenet.K8sManager.Auth.Authorization.Attributes
{
  /// <summary>
  /// Utilizar en Authorization.Policies.Enums.[Enumerado].[Miembro]
  /// para definir con qué parte del menú está relacionada la política.
  /// Pueden especificarse múltiples declaraciones de este atributo,
  /// lo que hará que aparezca en más de una sección.
  /// También aplicará una claim específica:
  /// <para>Tipo: <see cref="AppClaimTypes.CLAIM_TYPE_MENU_SECTION_PREFIX_DEFAULT"/> + "PolicyMenu"</para>
  /// <para>Valor: Miembro de PolicyMenu elegido</para>
  /// </summary>
  [AttributeUsage(AttributeTargets.Field, AllowMultiple = true)]
  public class PolicyMenuItemAttribute : PolicyRequiredClaimsAttribute
  {
    internal PolicyMenu MenuItem { get; private set; }
    internal PolicyMenuItemAttribute(PolicyMenu menuItem)
        : base($"{AppClaimTypes.CLAIM_TYPE_MENU_SECTION_PREFIX_DEFAULT}{nameof(PolicyMenu)}", menuItem.ToString())
    {
      MenuItem = menuItem;
    }
  }
}
