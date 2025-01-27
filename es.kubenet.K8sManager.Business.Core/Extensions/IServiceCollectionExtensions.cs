using es.kubenet.K8sManager.Business.Core.Services.DepartmentService;
using es.kubenet.K8sManager.Business.Core.Services.EmployeeServices;
using Microsoft.Extensions.DependencyInjection;

namespace es.kubenet.K8sManager.Business.Core.Extensions
{
  public static class IServiceCollectionExtensions
  {
    public static IServiceCollection AddProjectCoreServices(this IServiceCollection services)
    {
      return services
          .AddProjectDepartmentServices()
          .AddProjectEmployeesServices();
    }


    public static IServiceCollection AddProjectDepartmentServices(this IServiceCollection services)
    {
      return services.AddScoped<IDepartmentService, DepartmentService>();
    }
    public static IServiceCollection AddProjectEmployeesServices(this IServiceCollection services)
    {
      return services.AddScoped<IEmployeeService, EmployeeService>();
    }
  }
}
