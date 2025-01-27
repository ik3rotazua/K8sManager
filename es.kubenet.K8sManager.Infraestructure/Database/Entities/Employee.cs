using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using es.efor.Utilities.Database.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace es.kubenet.K8sManager.Infraestructure.Database.Entities
{
  public class Employee(string name, Guid departmentId, Guid userId) : EforDbEntity<Guid>
  {
    [Required]
    public string Name { get; set; } = name;
    public string? Surname1 { get; set; }
    public string? Surname2 { get; set; }


    [Required]
    public Guid DepartmentId { get; set; } = departmentId;
    [ForeignKey(nameof(DepartmentId))]
    public virtual Department? Department { get; set; }

    [Required]
    public Guid UserId { get; set; } = userId;
    public virtual AppUser User { get; set; } = null!;
  }
}
