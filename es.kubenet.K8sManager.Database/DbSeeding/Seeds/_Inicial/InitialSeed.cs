using es.kubenet.K8sManager.Auth.Managers;
using es.kubenet.K8sManager.Auth.Models;
using es.kubenet.K8sManager.Business.Core.Services.DepartmentService;
using es.kubenet.K8sManager.Business.Core.Services.EmployeeServices;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Database.DbSeeding.Seeds.Inicial
{

  internal class InitialSeed : _BaseSeed
  {
    private const string IDENTITY_ROLE_ADMIN = RoleNames.ROLE_ADMIN;
    private const string IDENTITY_USER_ADMIN = "Admin";
    private const string ENTITY_DPRT_DIRECTION = "Direction";
    private readonly ILogger<InitialSeed> Logger;

    public InitialSeed(
        IServiceProvider serviceProvider,
        List<__EFSeedingHistory> appliedSeeds)
        : base(serviceProvider, appliedSeeds)
    {
      Logger = serviceProvider.GetRequiredService<ILogger<InitialSeed>>();
    }


    internal override async Task StartSeedAsync()
    {
      var seedName = GetType().Name;
      if (IsSeedApplied(seedName))
      {
        return;
      }
      Logger.LogInformation("SavingSeeding [{seedName}]", seedName);

      await SeedIdentity();
      await SeedEntities();

      Logger.LogInformation("Saving changes into database...");
      await SetSeedAsDone(seedName, commit: true);
      db.ChangeTracker.Clear();
    }

    #region Identity
    private async Task SeedIdentity()
    {
      Logger.LogInformation("Seeding Identity...");

      await SeedIdentity_Roles();
      await SeedIdentity_Users();
    }

    private async Task SeedIdentity_Roles()
    {
      Logger.LogInformation("Seeding Roles...");
      var allClaims = Auth.Authorization.Policies.AppIdentityPolicies.GetAllPolicyClaims()
          .SelectMany(p => p.Value.SelectMany(pv => pv.Claims))
          .GroupBy(p => new { p.Type, p.Value })
          .SelectMany(g => g).ToList();

      #region ROLES
      var userSV = ServiceProvider.GetRequiredService<AppIdentityUserManager>();
      var roleSV = ServiceProvider.GetRequiredService<AppIdentityRoleManager>();

      var roleAdmin = await roleSV.FindByNameAsync(IDENTITY_ROLE_ADMIN);
      if (roleAdmin != null) { return; }

      roleAdmin = new Infraestructure.Database.AppIdentity.AppRole(IDENTITY_ROLE_ADMIN);
      var result = await roleSV.CreateAsync(roleAdmin);
      CheckIdentityResult(result);

      foreach (var c in allClaims)
      {
        await roleSV.AddClaimAsync(roleAdmin, c);
      }
      #endregion

    }
    private async Task SeedIdentity_Users()
    {
      var userSV = ServiceProvider.GetRequiredService<AppIdentityUserManager>();
      var roleSV = ServiceProvider.GetRequiredService<AppIdentityRoleManager>();

      Logger.LogInformation("Seeding Users...");
      var roleAdmin = (await roleSV.FindByNameAsync(IDENTITY_ROLE_ADMIN))
        ?? throw new NullReferenceException($"Role [{IDENTITY_ROLE_ADMIN}] is missing at database.");

      if (roleAdmin.Name == null)
      {
        throw new NullReferenceException($"Role [{IDENTITY_ROLE_ADMIN}] seems to be missing name at DB.");
      }

      var user = await db.Users
          .FirstOrDefaultAsync(d => d.UserName == IDENTITY_USER_ADMIN);

      if (user != null)
      {
        Logger.LogInformation("User [{userName}] is already at database", user.Name);
        return;
      }

      var userAdmin = new Infraestructure.Database.AppIdentity.AppUser(IDENTITY_USER_ADMIN);
      var result = await userSV.CreateAsync(userAdmin, "Admin!123");
      CheckIdentityResult(result);

      result = await userSV.SetLockoutEnabledAsync(userAdmin, false);
      CheckIdentityResult(result);

      result = await userSV.AddToRoleAsync(userAdmin, roleAdmin.Name);
      CheckIdentityResult(result);
    }



    private void CheckIdentityResult(IdentityResult result)
    {
      if (!result.Succeeded)
      {
        throw new AggregateException(result.Errors.Select(e => new Exception(e.Description)).ToList());
      }
    }
    #endregion

    #region Entities
    private async Task SeedEntities()
    {
      Logger.LogInformation("Seeding Entities...");
      var dptDirection = await SeedEntities_Departments();
      await SeedEntities_Employees(dptDirection);
    }
    private async Task<Department> SeedEntities_Departments()
    {
      Logger.LogInformation("Seeding Departments...");
      var departmentSV = ServiceProvider.GetRequiredService<IDepartmentService>();
      var dptmDirection = new Department(ENTITY_DPRT_DIRECTION);
      dptmDirection = await departmentSV.AddAsync(dptmDirection, commit: false);
      return dptmDirection;
    }
    private async Task<Employee> SeedEntities_Employees(Department dptDirection)
    {
      Logger.LogInformation("Seeding Employees...");
      var userSV = ServiceProvider.GetRequiredService<AppIdentityUserManager>();
      var userAdmin = await userSV.FindByNameAsync(IDENTITY_USER_ADMIN)
        ?? throw new NullReferenceException($"User [{IDENTITY_USER_ADMIN}] not found during initialization.");

      var employeeSV = ServiceProvider.GetRequiredService<IEmployeeService>();

      var emplAdmin = new Employee("Employee", dptDirection.Id, userAdmin.Id)
      {
        Surname1 = "Admin",
        Surname2 = "Surname 2",
      };

      emplAdmin = await employeeSV.AddAsync(emplAdmin, commit: false);
      return emplAdmin;
    }
    #endregion
  }
}
