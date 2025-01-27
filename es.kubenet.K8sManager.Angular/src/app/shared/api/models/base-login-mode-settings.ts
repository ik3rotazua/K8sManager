/* tslint:disable */
export interface BaseLoginModeSettings {

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
