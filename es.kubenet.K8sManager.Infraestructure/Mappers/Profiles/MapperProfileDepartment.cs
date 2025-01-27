using AutoMapper;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.kubenet.K8sManager.Infraestructure.Dto.Departments;

namespace es.kubenet.K8sManager.Infraestructure.Mappers.Profiles
{
  public class MapperProfileDepartment : Profile
  {
    public MapperProfileDepartment()
    {
      CreateMap<Department, DepartmentDTO>()
          .ReverseMap();
    }
  }
}
