using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace es.kubenet.K8sManager.Infraestructure.Mappers.Extensions
{
  public static class IServiceCollectionExtensions
  {
    public static IServiceCollection AddEntityMapper(this IServiceCollection services)
    {
      var service = new MapperConfiguration(mc =>
      {
        mc.AddProfile(new Profiles.MapperProfileAppUser());
        mc.AddProfile(new Profiles.MapperProfileDepartment());
        mc.AddProfile(new Profiles.MapperProfileEmployee());
      }).CreateMapper();
      return services.AddSingleton(service);
    }
  }
}
