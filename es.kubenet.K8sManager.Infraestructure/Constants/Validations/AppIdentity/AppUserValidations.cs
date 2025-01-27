namespace es.kubenet.K8sManager.Infraestructure.Constants.Validations.AppIdentity
{
  public static class AppUserValidations
  {
    public const int USER_PERSON_NAME_MAXLENGTH = 50;

    /// <summary>
    /// The name of the person for the user cannot exceed <see cref="USER_PERSON_NAME_MAXLENGTH"/> characters.
    /// </summary>
    public const string ERROR_USER_NAME_MAXLENGTH = "API.ERROR.USER.NAME.MAXLENGTH";
    /// <summary>
    /// The email is not valid
    /// </summary>
    public const string ERROR_USER_EMAILNOTIFICATIONS_NOTVALID = "API.ERROR.USER.EMAILNOTIFICATIONS.NOTVALID";
  }
}
