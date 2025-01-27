using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.efor.Utilities.Database.Models.Exceptions;
using es.efor.Utilities.Database.Services;
using es.efor.Utilities.Web.Identity;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace es.kubenet.K8sManager.Business.Core.Services.EmployeeServices
{
  public class EmployeeService
        : EforBaseBusiness<EmployeeService, AppDbContext, Guid, Employee>, IEmployeeService
  {
    public EmployeeService(AppDbContext dbContext, ILogger<EmployeeService> logger)
        : base(dbContext, logger) { }



    public override Task<Employee> AddEditAsync(Employee newData, bool commit = true)
    {
      return base.AddEditAsync(newData, commit);
    }
    public override Task<Employee> AddAsync(Employee newData, bool commit = true)
    {
      return base.AddAsync(newData, commit);
      //var errors = await GetErrorsForAddAsync(newData);
      //if (errors.Any())
      //{
      //    throw new AggregateException(errors.Select(e => new Exception(e)));
      //}

      //var newItem = new Employee()
      //{
      //    Name = newData.Name,
      //    DepartmentId = newData.DepartmentId,
      //    UserId = newData.UserId,
      //    Surname1 = newData.Surname1,
      //    Surname2 = newData.Surname2,
      //};

      //db.Add(newItem);
      //if (commit) db.SaveChanges();

      //return newItem;
    }

    public override async Task<Employee> EditAsync(Employee newData, bool commit = true)
    {
      var errors = await GetErrorsForEditAsync(newData);
      if (errors.Any())
      {
        throw new CustomValidationException<Department>(errors);
      }

      var atDb = await GetByIdAsync(newData.Id);
      atDb.Name = newData.Name;
      atDb.DepartmentId = newData.DepartmentId;
      atDb.UserId = newData.UserId;
      atDb.Surname1 = newData.Surname1;
      atDb.Surname2 = newData.Surname2;

      if (commit) { db.SaveChanges(); }

      return atDb;
    }



    protected override string GetTEntityCreatedByFromClaims(ClaimsPrincipal user)
    {
      return user.GetClaimId();
    }
  }
}