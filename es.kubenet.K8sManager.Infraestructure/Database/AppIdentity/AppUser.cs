using es.kubenet.K8sManager.Infraestructure.Constants.Validations.AppIdentity;
using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.Infraestructure.Database.AppIdentity
{
  public class AppUser : es.efor.Auth.Models.Entities.User<Guid>
  {
    #region Field
    [MaxLength(AppUserValidations.USER_PERSON_NAME_MAXLENGTH, ErrorMessage = AppUserValidations.ERROR_USER_NAME_MAXLENGTH)]
    public string? Name { get; set; }
    public string? Surname1 { get; set; }
    public string? Surname2 { get; set; }

    /// <summary>
    /// Dirección de email a la que se enviarán las notificaciones de la aplicación
    /// </summary>
    [EmailAddress(ErrorMessage = AppUserValidations.ERROR_USER_EMAILNOTIFICATIONS_NOTVALID)]
    public string? EmailNotifications { get; set; }

    public string? AvatarRoute { get; set; }


    [Required]
    public DateTimeOffset DCreated { get; set; }
    public DateTimeOffset? DModified { get; set; }

    [Required]
    public string CreatedBy { get; set; } = null!;
    public string? ModifiedBy { get; set; }

    #endregion

    public AppUser()
      : base()
    { }

    public AppUser(string userName)
      : base(userName)
    { }
  }
}
