using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Database.DbSeeding.Seeds
{
  public abstract class _BaseSeed : IDisposable
  {
    protected readonly IServiceScope ServiceScope;
    protected readonly IServiceProvider ServiceProvider;

    #region db
    private AppDbContext? _db;
    protected AppDbContext db
    {
      get
      {
        if (_db == null) { _db = ServiceProvider.GetRequiredService<AppDbContext>(); }
        return _db;
      }
    }
    #endregion
    #region MigrationHistory
    protected List<__EFSeedingHistory> SeedingHistory { get; set; }
    #endregion


    public _BaseSeed(
        IServiceProvider serviceProvider,
        List<__EFSeedingHistory> appliedSeeds
        )
    {
      ServiceProvider = serviceProvider;
      ServiceScope = ServiceProvider.CreateScope();
      SeedingHistory = appliedSeeds;
    }


    internal abstract Task StartSeedAsync();

    /// <summary>
    /// Checks wether the given <paramref name="seedName"/> has been applied at the
    /// <see cref="AppDbContext.__EFSeedingHistory"/> table.
    /// </summary>
    /// <param name="seedName"></param>
    /// <returns></returns>
    protected bool IsSeedApplied(string seedName)
    {
      return SeedingHistory.Any(h => h.SeedingId.Equals(seedName));
    }

    protected async Task SetSeedAsDone(string seedName, bool commit = true)
    {
      var seed = new __EFSeedingHistory(seedName);
      seed = (await db.__EFSeedingHistory.AddAsync(seed)).Entity;
      SeedingHistory.Add(seed);

      if (commit)
      {
        await db.SaveChangesAsync();

        // Free memory
        db.ChangeTracker.Clear();
      }
    }

    public virtual void Dispose()
    {
      db.Dispose();
      _db = null;
      GC.SuppressFinalize(this);
      GC.Collect();
    }
  }
}
