using es.efor.Auth.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Attributes;
using es.kubenet.K8sManager.Auth.Authorization.Policies.Menu;
using es.efor.Utilities.General;
using es.efor.Utilities.Web.Identity.Authorization.Policies.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Security.Claims;

namespace es.kubenet.K8sManager.Auth.Authorization.Policies
{
  public static class AppIdentityPolicies
  {
    /// <summary>
    /// "es.kubenet.K8sManager.Auth.Authorization.Policies.Enums"
    /// </summary>
    private static string POLICY_ENUM_NAMESPACE = typeof(Enums.UserManagementPolicies).Namespace
      ?? throw new NullReferenceException("Namepsace metadata cannot be null.");
    private static IDictionary<string, IEnumerable<PolicyModelView>>? _allPolicyClaims;
    private static IEnumerable<PolicyMenuItem>? _allPolicyClaimsByMenu;


    public static IDictionary<string, IEnumerable<PolicyModelView>> GetAllPolicyClaims(bool forceRefresh = false)
    {
      if (!forceRefresh && _allPolicyClaims != null && _allPolicyClaims.Any())
      {
        return _allPolicyClaims;
      }

      // Los enumerados dentro de Edor.SupervisionConsole.Identity.Authorization.Policies
      // controlan las definiciones de las políticas de forma sencilla,
      // mediante atributos y valores.
      // Para aplicar un Policy definido por estos enumerados, basta con utilizar
      // [Authorize(nameof(Authorization.Policies.Enums.[Enumerado].[Valor]))]
      var allPolicyClaims = new SortedDictionary<string, IEnumerable<PolicyModelView>>();
      var typeOfClass = typeof(AppIdentityPolicies);
      var allPolicyEnums = (Assembly.GetAssembly(typeOfClass) ?? throw new Exception("Assembly metadata not found."))
          .GetTypes()
          .Where(t => t.IsEnum)
          .Where(t => t.Namespace == POLICY_ENUM_NAMESPACE)
          .ToList();

      var getDescrMethod = typeOfClass.GetMethod(nameof(GetDescriptionOfEnumType), BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
        ?? throw new NullReferenceException("Method is missing binding modifier (public, private, etc.)");
      var getClaimsMethod = typeOfClass.GetMethod(nameof(GetAllPolicyClaimsByPolicyEnum), BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
        ?? throw new NullReferenceException("Method is missing binding modifier (public, private, etc.)");
      foreach (var e in allPolicyEnums)
      {
        var getDescrMethodGeneric = getDescrMethod.MakeGenericMethod(e)
          ?? throw new NullReferenceException("Could not build the generic method.");
        var getClaimsMethodGeneric = getClaimsMethod.MakeGenericMethod(e);
        var description = getDescrMethodGeneric.Invoke(null, null)?.ToString()
          ?? throw new NullReferenceException("Description must be specified for the enum.");
        var claims = (IEnumerable<PolicyModelView>)(getClaimsMethodGeneric.Invoke(null, null)
          ?? throw new NullReferenceException("Claims are not defined."));

        allPolicyClaims.Add(description, claims);
      }

      _allPolicyClaims = allPolicyClaims;

      return _allPolicyClaims;
    }

    public static IEnumerable<PolicyMenuItem> GetAllPolicyClaimsByMenu(bool forceRefresh = false)
    {
      if (!forceRefresh && _allPolicyClaimsByMenu != null && _allPolicyClaimsByMenu.Any()) return _allPolicyClaimsByMenu;

      var policyMenuTabs = EnumHelper.GetEnumValues<PolicyMenu>();
      var policyMenu = policyMenuTabs.Select(t => new PolicyMenuItem()
      {
        MenuItem = t,
      }).ToList();
      var policyMenuSections = new List<PolicySectionModelView>();

      var typeOfClass = typeof(AppIdentityPolicies);
      var allPolicyEnums = (Assembly.GetAssembly(typeOfClass) ?? throw new NullReferenceException("Assembly metadata not found."))
          .GetTypes()
          .Where(t => t.IsEnum)
          .Where(t => t.Namespace == POLICY_ENUM_NAMESPACE)
          .ToList();

      var getDescrMethod = typeOfClass.GetMethod(nameof(GetDescriptionOfEnumType), BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
        ?? throw new NullReferenceException("Method is missing binding modifier (public, private, etc.)"); ;
      var getClaimsMethod = typeOfClass.GetMethod(nameof(GetAllPolicyClaimsByPolicyEnum), BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
        ?? throw new NullReferenceException("Method is missing binding modifier (public, private, etc.)"); ;
      var getEnumValuesMethod = typeof(EnumHelper).GetMethod(nameof(EnumHelper.GetEnumValues), BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)
        ?? throw new NullReferenceException("Method is missing binding modifier (public, private, etc.)"); ;

      foreach (var e in allPolicyEnums)
      {
        var getDescrMethodGeneric = getDescrMethod.MakeGenericMethod(e)
          ?? throw new NullReferenceException("Could not build the generic method."); ;
        var getClaimsMethodGeneric = getClaimsMethod.MakeGenericMethod(e);
        var getEnumValuesMethodGeneric = getEnumValuesMethod.MakeGenericMethod(e);

        var description = getDescrMethodGeneric.Invoke(null, null)?.ToString()
          ?? throw new NullReferenceException("Description must be specified for the enum.");
        var claims = (IEnumerable<PolicyModelView>)(getClaimsMethodGeneric.Invoke(null, null) ?? throw new NullReferenceException("Claims are not defined."));

        var policies = Enum.GetValues(e);
        //var policies = (IEnumerable<Enum>)getEnumValuesMethodGeneric.Invoke(null, null);

        foreach (Enum p in policies)
        {
          var policyMenus = GetPolicyMenuItems(p);
          var pClaims = claims.Where(c => c.Policy == p.ToString());
          foreach (var m in policyMenus)
          {
            var menuTab = policyMenu.First(mt => mt.MenuItem == m);
            var menuSection = menuTab.Sections.FirstOrDefault(ms => ms.SectionType == e);
            if (menuSection == null)
            {
              menuSection = new PolicySectionModelView() { SectionType = e };
              menuTab.Sections.Add(menuSection);
            }
            menuSection.Policies.AddRange(pClaims);
          }
        }
      }

      _allPolicyClaimsByMenu = policyMenu;
      return _allPolicyClaimsByMenu;
    }

    public static IEnumerable<PolicyModelView> GetAllPolicyClaimsByPolicyEnum<TPolicyEnum>()
        where TPolicyEnum : Enum
    {
      // Cada miembro de un enumerado es un Policy,
      // que tiene uno o varios Claims asignados.
      // Un usuario cumple con los requisitos de la política
      // si tiene todos los claims.

      var policyEnums = EnumHelper.GetEnumValues<TPolicyEnum>();
      var policyEnumType = typeof(TPolicyEnum);

      var policies = new List<PolicyModelView>();
      foreach (var p in policyEnums)
      {
        //var policyMemberInfo = policyEnumType.GetMember(p.ToString())
        //    .First();
        //var policyClaims = policyMemberInfo
        //    .GetCustomAttributes<PolicyRequiredClaimsAttribute>()
        //    .Select(c => new Claim(c.ClaimType, c.ClaimValue))
        //    .ToList();

        //if (!policyClaims.Any()) throw new Exception($"El enumerado [{policyEnumType.Name}] no contiene una definición de claims para su miembro [{p}]");

        //var policyDescription = p.GetDescription() ?? p.ToString();
        //var policy = new PolicyModelView()
        //{
        //    Policy = p.ToString(),
        //    Description = policyDescription,
        //    Claims = policyClaims
        //};
        var policy = GetPolicyEnumMemberClaims(policyEnumType, p);
        policies.Add(policy);
      }

      return policies.OrderBy(p => p.Description);
    }

    /// <summary>
    /// Recupera el modelo de políticas de permisos para el **MIEMBRO** <paramref name="policyEnumMember"/> del enumerado <paramref name="policyEnumType"/> especificado.
    /// </summary>
    /// <typeparam name="TPolicyEnumMember">Especificación del miembro del enumerado cuya definición se quiere obtener</typeparam>
    /// <param name="policyEnumType">Tipo (typeof) del **ENUMERADO** que contiene el miembro</param>
    /// <param name="policyEnumMember">Miembro del enumerado cuya definicón se quiere obtener</param>
    /// <returns></returns>
    public static PolicyModelView GetPolicyEnumMemberClaims<TPolicyEnumMember>(Type policyEnumType, TPolicyEnumMember policyEnumMember)
        where TPolicyEnumMember : Enum
    {
      var policyMemberInfo = policyEnumType.GetMember(policyEnumMember.ToString())
          .FirstOrDefault();
      if (policyMemberInfo == null)
      {
        throw new ArgumentException($"Enum member [{policyEnumMember}] must belong to [{policyEnumType?.Name ?? "--NULL ENUM--"}]");
      }

      var policyClaims = policyMemberInfo
          .GetCustomAttributes<PolicyRequiredClaimsAttribute>()
          .Select(c => new Claim(c.ClaimType, c.ClaimValue))
          .ToList();

      if (!policyClaims.Any()) throw new Exception($"El enumerado [{policyEnumType.Name}] no contiene una definición de claims para su miembro [{policyEnumMember}]");

      var policyDescription = policyEnumMember.GetDescription() ?? policyEnumMember.ToString();
      var policy = new PolicyModelView()
      {
        Policy = policyEnumMember.ToString(),
        PolicyEnum = policyEnumMember,
        Description = policyDescription,
        Claims = policyClaims
      };
      return policy;
    }

    private static string GetDescriptionOfEnumType<TEnumType>()
    {
      var type = typeof(TEnumType);
      var description = type.GetCustomAttribute<DescriptionAttribute>()?
          .Description;
      return description ?? type.Name;
    }

    /// <summary>
    /// Recupera las secciones de Menu al cual pertenece esta política
    /// </summary>
    private static IEnumerable<PolicyMenu> GetPolicyMenuItems(Enum value)
    {
      var type = value.GetType();
      var typeValue = type.GetMember(value.ToString());
      var menuSections = (typeValue.FirstOrDefault()
        ?.GetCustomAttributes<PolicyMenuItemAttribute>(false)
        ?? [])
        .Select(a => a.MenuItem)
        .Distinct()
        .ToList()
        .AsReadOnly();

      return menuSections;
    }
  }
}
