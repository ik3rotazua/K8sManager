using es.kubenet.K8sManager.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Business.Accounts.AccountServices
{
  /// <inheritdoc cref="IAccountService"/>
  public class AccountService : IAccountService
  {
    private readonly ILogger Logger;
    private readonly AppDbContext Db;

    public AccountService(
        ILogger<AccountService> logger,
        AppDbContext db)
    {
      Logger = logger;
      Db = db;
    }

    /// <inheritdoc cref="IAccountService.GetExtraClaimsByUserNameAsync(string)"/>
    public async Task<IEnumerable<Claim>> GetExtraClaimsByUserNameAsync(string userName)
    {
      var extraClaims = new List<Claim>();

      var employee = await Db.Employees
          .Include(e => e.Department)
          .Include(e => e.User)
          .Where(e => e.User.UserName == userName)
          .FirstOrDefaultAsync();

      if (employee != null)
      {
        extraClaims.Add(new Claim("EmplDepartment", employee.DepartmentId.ToString()));
      }

      return extraClaims;
    }
  }
}
