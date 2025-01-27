using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace es.kubenet.K8sManager.Auth.Extensions
{
  public static class IListClaimsExtensions
  {
    /// <summary>
    /// Returns the claims at <paramref name="source"/>, with only
    /// one claim per type and value combination.
    /// <br></br>
    /// There will be no more than one claim with the same
    /// <see cref="Claim.Type"/> and <see cref="Claim.Value"/>.
    /// </summary>
    /// <param name="source">The list to be reduced</param>
    public static IList<Claim> UniqueOnly(this IList<Claim> source)
    {
      return source
          .GroupBy(c => new { c.Type, c.Value })
          .Select(g => g.First())
          .ToList();
    }

    /// <inheritdoc cref="UniqueOnly(IList{Claim})"/>
    public static IList<Claim> WithoutDuplicates(this IList<Claim> source)
    {
      return source.UniqueOnly();
    }
  }
}
