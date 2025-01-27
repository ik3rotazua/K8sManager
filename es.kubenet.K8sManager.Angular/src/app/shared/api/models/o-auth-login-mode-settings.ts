/* tslint:disable */
export interface OAuthLoginModeSettings {

  /**
   * URL que de la API ejecuta el proceso de inicio de sesión.
   * Debe empezar con la raíz de la API, y no incluir dominio.
   * Por ejemplo:
   * ```/api/account/oauth_ms```
   */
  apiRootUrl: string;

  /**
   * Imagen que representa este login de OAuth. Por ejemplo:
   * ```/assets/img/oauth/ms/ms-logo.svg```
   * Debe ser accesible desde frontend de forma anónima.
   */
  imageUrl: string;

  /**
   * Especifica si la opción de autenticación está configurada.
   */
  isEnabled: boolean;

  /**
   * Texto que se incluirá en el botón de este login.
   * <br></br>
   * Frontend intentará traducirlo, por lo que se puede utilizar
   * un código de traducción. Si el código no está disponible,
   * se mostrará el texto tal cual se encuentra configurado
   * en este método.
   */
  label: string;
}
