using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Business.Accounts.AccountServices
{
  /// <summary>
  /// An add-on service that resolves queries related to fetching
  /// or operating with the logged in user's data, that are not
  /// directly stored within the Identity services by using
  /// User or SignIn managers.
  /// <br></br>
  /// For example, for getting extra claims related to a logged in
  /// user by checking other entities at the database.
  /// </summary>
  public interface IAccountService
  {
    /// <summary>
    /// Fetches app related Authorization Claims that are controlled
    /// by database entities. For instance, the user's employee's department.
    /// These are commonly used so that extra filters can be applied
    /// when using the application.
    /// </summary>
    public Task<IEnumerable<Claim>> GetExtraClaimsByUserNameAsync(string userName);
  }
}
