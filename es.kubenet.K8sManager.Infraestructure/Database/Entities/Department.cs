using es.efor.Utilities.Database.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Database.Entities
{
  public class Department(string name) : EforDbEntity<Guid>
  {
    [Required]
    public string Name { get; set; } = name;

    public virtual ICollection<Employee> Employees { get; set; } = null!;
  }
}
