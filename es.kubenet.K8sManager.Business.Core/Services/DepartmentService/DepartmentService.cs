using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.efor.Utilities.Database.Models.Exceptions;
using es.efor.Utilities.Database.Services;
using es.efor.Utilities.Web.Identity;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace es.kubenet.K8sManager.Business.Core.Services.DepartmentService
{
  public class DepartmentService : EforBaseBusiness<DepartmentService, AppDbContext, Guid, Department>, IDepartmentService
  {
    public DepartmentService(AppDbContext dbContext, ILogger<DepartmentService> logger)
        : base(dbContext, logger) { }


    public override Task<Department> AddEditAsync(Department newData, bool commit = true)
    {
      return base.AddEditAsync(newData, commit);
    }

    public override Task<Department> AddAsync(Department newData, bool commit = true)
    {
      return base.AddAsync(newData, commit);
      //var errors = await GetErrorsForAddAsync(newData);
      //if (errors.Any())
      //{
      //    throw new AggregateException(errors.Select(e => new Exception(e)));
      //}

      //var newItem = new Department()
      //{
      //    Name = newData.Name,
      //};

      //db.Add(newItem);
      //if (commit) db.SaveChanges();

      //return newItem;
    }

    public override async Task<Department> EditAsync(Department newData, bool commit = true)
    {
      var errors = await GetErrorsForEditAsync(newData);
      if (errors.Any())
      {
        throw new CustomValidationException<Department>(errors);
      }

      var atDb = await GetByIdAsync(newData.Id);
      atDb.Name = newData.Name;

      if (commit) db.SaveChanges();

      return atDb;
    }

    protected override string GetTEntityCreatedByFromClaims(ClaimsPrincipal user)
    {
      return user.GetClaimId();
    }
  }
}
