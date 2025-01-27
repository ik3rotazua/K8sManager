using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.efor.Utilities.Database.Models;
using es.efor.Utilities.Web.Identity;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Data.Context
{
  public class AppDbContext
        : IdentityDbContext<AppUser, AppRole, Guid>,
        IDataProtectionKeyContext
  {
    #region DOC - Migraciones
    // --project es.kubenet.K8sManager.Data --startup-project es.kubenet.K8sManager.MainGateway

    // dotnet ef migrations add <MigrationName> --project es.kubenet.K8sManager.Data --startup-project es.kubenet.K8sManager.MainGateway
    // dotnet ef migrations remove --project es.kubenet.K8sManager.Data --startup-project es.kubenet.K8sManager.MainGateway
    // dotnet ef database update <MigrationName> --project es.kubenet.K8sManager.Data --startup-project es.kubenet.K8sManager.MainGateway
    #endregion

    #region DbSet - Entidades
    /// <summary>
    /// Database information seeding entities.
    /// </summary>
    public virtual DbSet<__EFSeedingHistory> __EFSeedingHistory { get; set; }
    /// <summary>
    /// Contiene datos de claves compartidas entre instancias de la misma aplicación
    /// </summary>
    public virtual DbSet<DataProtectionKey> DataProtectionKeys { get; set; }


    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<Department> Departments { get; set; }
    #endregion

    private readonly IHttpContextAccessor _accessor;
    public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor accessor) : base(options)
    {
      _accessor = accessor;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      // // Global filters
      // // WARNING: BEWARE NESTED ENTITIES WITH GLOBAL FILTERS:
      // // This mmay lead to unexpected results when the required entity is filtered out.
      // // Either configure the navigation as optional, or define matching query filters
      // // for both entities in the navigation.
      //modelBuilder.Entity<AppUser>().HasQueryFilter(x => !x.Deleted);

      base.OnModelCreating(modelBuilder);
    }


    /// <inheritdoc cref="DbContext.SaveChangesAsync(bool, CancellationToken)"/>
    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default(CancellationToken))
    {
      SetGenericProperties();
      return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }
    /// <inheritdoc cref="DbContext.SaveChanges()"/>
    public override int SaveChanges()
    {
      SetGenericProperties();
      return base.SaveChanges();
    }
    /// <inheritdoc cref="DbContext.SaveChanges(bool)"/>
    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
      SetGenericProperties();
      return base.SaveChanges(acceptAllChangesOnSuccess);
    }
    /// <inheritdoc cref="DbContext.SaveChangesAsync(CancellationToken)"/>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      SetGenericProperties();
      return base.SaveChangesAsync(cancellationToken);
    }


    /// <summary>
    /// Looks for any <see cref="EforDbEntity{TId}"/> compatible entity
    /// and sets up their data.
    /// </summary>
    private void SetGenericProperties()
    {
      var AddedEntities = ChangeTracker.Entries()
          .Where(E => E.State == EntityState.Added)
          .ToList();

      AddedEntities.ForEach(E =>
      {
        var T = E.Entity.GetType();
        if (T.GetProperty(nameof(EforDbEntity<Guid>.DCreated)) != null)
        {
          E.Property(nameof(EforDbEntity<Guid>.DCreated)).CurrentValue = DateTimeOffset.Now;
        }
        if (T.GetProperty(nameof(EforDbEntity<Guid>.CreatedBy)) != null)
        {
          E.Property(nameof(EforDbEntity<Guid>.CreatedBy)).CurrentValue = _accessor?.HttpContext?.User?.GetClaimId() ?? "unkown";
        }
      });

      var EditedEntities = ChangeTracker.Entries()
          .Where(E => E.State == EntityState.Modified)
          .ToList();

      EditedEntities.ForEach(E =>
      {
        var T = E.Entity.GetType();
        if (T.GetProperty(nameof(EforDbEntity<Guid>.DModified)) != null)
        {
          E.Property(nameof(EforDbEntity<Guid>.DModified)).CurrentValue = DateTimeOffset.Now;
        }
        if (T.GetProperty(nameof(EforDbEntity<Guid>.ModifiedBy)) != null)
        {
          E.Property(nameof(EforDbEntity<Guid>.ModifiedBy)).CurrentValue = _accessor?.HttpContext?.User?.GetClaimId() ?? "unkown";
        }
      });
    }
  }
}
