/* tslint:disable */
import { BaseLoginModeSettings } from './base-login-mode-settings';
import { OAuthLoginModeSettings } from './o-auth-login-mode-settings';

/**
 * Especifica la configuración de autenticación que backend
 * debe proporcionar a frontend.
 * <br></br>
 * Esta clase no configura los inicios de sesión: tan solo
 * informa a frontend de cómo está configurada y qué opciones
 * existen, además de controlar los accesos por API para
 * realizar validaciones.
 * <br></br>
 * Las opciones que no estén definidas se tomarán como deshabiltiadas.
 */
export interface LoginModeSettings {
  localUserPass?: BaseLoginModeSettings;
  oAuthMicrosoft?: OAuthLoginModeSettings;
}
