using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace es.kubenet.K8sManager.MainGateway.Models.Configs
{
  /// <summary>
  /// Especifica la configuración de autenticación que backend
  /// debe proporcionar a frontend.
  /// <br></br>
  /// Esta clase no configura los inicios de sesión: tan solo
  /// informa a frontend de cómo está configurada y qué opciones
  /// existen, además de controlar los accesos por API para
  /// realizar validaciones.
  /// <br></br>
  /// Las opciones que no estén definidas se tomarán como deshabiltiadas.
  /// </summary>
  public class LoginModeSettings
  {
    /// <summary>
    /// Configuración que especifica si el login local con usuario
    /// y contraseña está habilitado.
    /// </summary>
    public BaseLoginModeSettings? LocalUserPass { get; set; }

    /// <summary>
    /// Configuración que especifica cómo está configurado el OAuth
    /// con Microsoft.
    /// </summary>
    public OAuthLoginModeSettings? OAuthMicrosoft { get; set; }

    public void EnsureSettings()
    {
      EnsureSettings(this);
    }

    public static void EnsureSettings(LoginModeSettings settings)
    {
      var errors = new List<string>();

      try
      {
        settings.LocalUserPass?.EnsureSettings();
      }
      catch (AggregateException exBase)
      {
        errors.AddRange(exBase.InnerExceptions.Select(ex => ex.GetBaseException().Message));
      }

      try
      {
        settings.OAuthMicrosoft?.EnsureSettings();
      }
      catch (AggregateException exBase)
      {
        errors.AddRange(exBase.InnerExceptions.Select(ex => ex.GetBaseException().Message));
      }

      if (errors.Any())
      {
        throw new AggregateException(
            message: "La configuración de las opciones disponibles para el inicio de sesión no están correctamente configuradas.",
            innerExceptions: errors.Select(err => new Exception(err))
            );
      }
    }

    public LoginModeSettings GenerateDto()
    {
      return GenerateDto(this);
    }

    public static LoginModeSettings GenerateDto(LoginModeSettings original)
    {
      var result = new LoginModeSettings()
      {
        LocalUserPass = new BaseLoginModeSettings(),
        OAuthMicrosoft = new OAuthLoginModeSettings(),
      };

      if (original?.LocalUserPass?.IsEnabled ?? false)
      {
        result.LocalUserPass = JsonConvert.DeserializeObject<BaseLoginModeSettings>(
            JsonConvert.SerializeObject(original.LocalUserPass)
            );
      }

      if (original?.OAuthMicrosoft?.IsEnabled ?? false)
      {
        result.OAuthMicrosoft = JsonConvert.DeserializeObject<OAuthLoginModeSettings>(
            JsonConvert.SerializeObject(original.OAuthMicrosoft)
            );
      }

      return result;
    }
  }


  public class BaseLoginModeSettings
  {
    /// <summary>
    /// Especifica si la opción de autenticación está configurada.
    /// </summary>
    [Required]
    public bool IsEnabled { get; set; } = false;

    /// <summary>
    /// Texto que se incluirá en el botón de este login.
    /// <br></br>
    /// Frontend intentará traducirlo, por lo que se puede utilizar
    /// un código de traducción. Si el código no está disponible,
    /// se mostrará el texto tal cual se encuentra configurado
    /// en este método.
    /// </summary>
    [Required]
    public string Label { get; set; } = string.Empty;

    public virtual void EnsureSettings()
    {
      var errors = new List<string>();
      if (IsEnabled && string.IsNullOrWhiteSpace(Label))
      {
        errors.Add("Falta el valor del texto para la opción de inicio de sesión.");
      }

      if (errors.Any())
      {
        throw new AggregateException(
            message: "La configuración de la opción de inicio de sesión no es correcta.",
            innerExceptions: errors.Select(err => new Exception(err))
            );
      }
    }
  }

  public class OAuthLoginModeSettings : BaseLoginModeSettings
  {
    /// <summary>
    /// Imagen que representa este login de OAuth. Por ejemplo:
    /// <code>/assets/img/oauth/ms/ms-logo.svg</code>
    /// Debe ser accesible desde frontend de forma anónima.
    /// </summary>
    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// URL que de la API ejecuta el proceso de inicio de sesión.
    /// Debe empezar con la raíz de la API, y no incluir dominio.
    /// Por ejemplo:
    /// <code>/api/account/oauth_ms</code>
    /// </summary>
    [Required]
    public string ApiRootUrl { get; set; } = string.Empty;

    public virtual new void EnsureSettings()
    {
      var errors = new List<string>();
      try
      {
        base.EnsureSettings();
      }
      catch (AggregateException exBase)
      {
        errors.AddRange(exBase.InnerExceptions.Select(ex => ex.GetBaseException().Message));
      }

      if (string.IsNullOrWhiteSpace(ImageUrl))
      {
        errors.Add("La imagen para la opción de OAuth no ha sido establecida.");
      }

      if (string.IsNullOrWhiteSpace(ApiRootUrl))
      {
        errors.Add("La url de la API para la opción de OAuth no ha sido establecida.");
      }
      else if (!ApiRootUrl.StartsWith("/api/"))
      {
        errors.Add("La url de la API para la opción de OAuth no es parte de la API (debe empezar con \"/api/\")");
      }

      if (errors.Any())
      {
        throw new AggregateException(
            message: "La configuración de la opción de inicio de sesión delegada (OAuth) no es correcta.",
            innerExceptions: errors.Select(err => new Exception(err))
            );
      }
    }
  }
}
