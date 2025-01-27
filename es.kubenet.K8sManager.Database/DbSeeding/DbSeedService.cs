using es.kubenet.K8sManager.Data.Context;
using es.kubenet.K8sManager.Database.DbSeeding.Seeds.Inicial;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.Database.DbSeeding
{
  internal class DbSeedService : IDisposable
  {
    private readonly IServiceScope ServiceScope;
    private readonly IServiceProvider ServiceProvider;

    #region db
    private AppDbContext? _db;
    private AppDbContext db
    {
      get
      {
        if (_db == null)
        {
          _db = ServiceProvider.GetRequiredService<AppDbContext>();
        }
        return _db;
      }
    }
    #endregion
    #region MigrationHistory
    private List<__EFSeedingHistory>? _SeedingHistory;
    private List<__EFSeedingHistory> SeedingHistory
    {
      get
      {
        if (_SeedingHistory == null)
        {
          _SeedingHistory = db.__EFSeedingHistory.ToList();
        }
        return _SeedingHistory;
      }
    }
    #endregion


    internal DbSeedService(IApplicationBuilder app)
    {
      ServiceScope = app.ApplicationServices.CreateScope();
      ServiceProvider = ServiceScope.ServiceProvider;
    }

    internal async Task StartSeeding()
    {
      var seed_Initial = new InitialSeed(ServiceProvider, SeedingHistory);
      await seed_Initial.StartSeedAsync();
    }


    private async Task SeedEntities()
    {
      // Entity migration is a little bit different, as it may depend on the migration that is going to be set.
      await SeedEntities_Initial();
    }


    private async Task SeedEntities_Initial()
    {
      var seed_Initial = new InitialSeed(ServiceProvider, SeedingHistory);
      await seed_Initial.StartSeedAsync();
    }


    public void Dispose()
    {
      ServiceScope.Dispose();
    }
  }
}
