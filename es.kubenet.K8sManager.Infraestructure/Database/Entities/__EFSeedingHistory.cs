using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Database.Entities
{
  /// <summary>
  /// Entity that retains information on what data has been seeded
  /// </summary>
  public class __EFSeedingHistory(string id)
  {
    [Key]
    public string SeedingId { get; set; } = id;

    [Obsolete("For EntityFramework use only.")]
    public __EFSeedingHistory()
      : this(string.Empty)
    { }
  }
}
