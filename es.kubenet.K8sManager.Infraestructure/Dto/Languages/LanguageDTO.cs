using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Dto.Languages
{
  public class LanguageDTO(string id, string nameIso, string nameNative)
  {
    [Required]
    public string Id { get; set; } = id;
    [Required]
    public string NameIso { get; set; } = nameIso;
    [Required]
    public string NameNative { get; set; } = nameNative;
  }
}
