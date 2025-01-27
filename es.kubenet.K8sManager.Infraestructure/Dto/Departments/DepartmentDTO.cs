using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Dto.Departments
{
  public class DepartmentDTO
  {
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
  }
}
