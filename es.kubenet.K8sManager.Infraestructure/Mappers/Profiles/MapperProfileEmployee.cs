using AutoMapper;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.kubenet.K8sManager.Infraestructure.Dto.Employees;

namespace es.kubenet.K8sManager.Infraestructure.Mappers.Profiles
{
  public class MapperProfileEmployee : Profile
  {
    public MapperProfileEmployee()
    {
      CreateMap<Employee, EmployeeDTO>()
          .ForMember(emplDto => emplDto.UserName, options => options.MapFrom(empl => empl.User.UserName))
          .ForMember(emplDto => emplDto.Department, options => options.MapFrom(empl => empl.Department))
          .ReverseMap()
          .ForMember(empl => empl.User, options => options.Ignore());
    }
  }
}
