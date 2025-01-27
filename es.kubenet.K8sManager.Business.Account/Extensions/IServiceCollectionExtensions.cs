using es.kubenet.K8sManager.Business.Accounts.AccountServices;
using Microsoft.Extensions.DependencyInjection;

namespace es.kubenet.K8sManager.Business.Accounts.Extensions
{
  public static class IServiceCollectionExtensions
  {
    public static IServiceCollection AddProjectAccountsServices(this IServiceCollection services)
    {
      return services.AddScoped<IAccountService, AccountService>();
    }
  }
}
