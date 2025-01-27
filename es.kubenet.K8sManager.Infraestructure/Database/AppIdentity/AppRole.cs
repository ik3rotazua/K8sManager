using System;

namespace es.kubenet.K8sManager.Infraestructure.Database.AppIdentity
{
  public class AppRole : es.efor.Auth.Models.Entities.Role<Guid>
  {
    public AppRole() : base() { }
    public AppRole(string roleName) : base(roleName) { }
  }
}
