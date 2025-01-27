using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Dto.Users
{
  public class UserDTO
  {
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string UserName { get; set; } = null!;

    [Required]
    public bool LockoutEnabled { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
  }
}
