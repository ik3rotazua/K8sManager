using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.efor.Utilities.Database.Services;

namespace es.kubenet.K8sManager.Business.Core.Services.EmployeeServices
{
  public interface IEmployeeService
        : IEforBaseBusiness<EmployeeService, AppDbContext, Guid, Employee>
  {
  }
}