using System;
using System.ComponentModel.DataAnnotations;

namespace es.kubenet.K8sManager.MainGateway.Models.Configs
{
  public class CorsPolicySettings
  {
    /// <summary>
    /// Orígenes permitidos para realizar las peticiones CORS.
    /// Obligatorio. No puede dejarse vacío.
    /// </summary>
    [Required]
    public string[] Origins { get; set; } = Array.Empty<string>();
    /// <summary>
    /// Cabeceras permitidas en las peticiones CORS.
    /// <br></br>
    /// null = Cualquiera.
    /// <br></br>
    /// <br></br>
    /// Predeterminado: null (cualquiera).
    /// </summary>
    public string[]? Headers { get; set; } = null;
    /// <summary>
    /// Métodos permitidos en las peticiones CORS.
    /// <br></br>
    /// null = Cualquiera.
    /// <br></br>
    /// <br></br>
    /// Predeterminado: null (cualquiera).
    /// </summary>
    public string[]? Methods { get; set; } = null;
    /// <summary>
    /// Establece si se permite el traspaso de credenciales
    /// (cookies, cabecera Authentication, etc.) en las peticiones
    /// CORS.
    /// <br></br>
    /// <br></br>
    /// Predeterminado: true (permitir).
    /// </summary>
    public bool AllowCredentials { get; set; } = true;
  }
}
