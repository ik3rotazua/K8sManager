using AutoMapper;
using es.kubenet.K8sManager.Infraestructure.Database.AppIdentity;
using es.kubenet.K8sManager.Infraestructure.Dto.Users;

namespace es.kubenet.K8sManager.Infraestructure.Mappers.Profiles
{
  public class MapperProfileAppUser : Profile
  {
    public MapperProfileAppUser()
    {
      CreateMap<AppUser, UserDTO>();
    }
  }
}
