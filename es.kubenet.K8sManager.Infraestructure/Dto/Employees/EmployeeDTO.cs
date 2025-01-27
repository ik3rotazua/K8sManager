using es.kubenet.K8sManager.Infraestructure.Dto.Departments;
using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Dto.Employees
{
  public class EmployeeDTO
  {
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;
    public string? Surname1 { get; set; }
    public string? Surname2 { get; set; }

    [Required]
    public string UserName { get; set; } = null!;


    [Required]
    public DepartmentDTO Department { get; set; } = null!;
    [Required]
    public Guid DepartmentId { get; set; }
  }
}
