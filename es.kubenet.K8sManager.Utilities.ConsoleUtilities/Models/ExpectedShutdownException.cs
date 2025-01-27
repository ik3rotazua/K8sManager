namespace es.kubenet.K8sManager.Utilities.ConsoleUtilities.Models
{
  /// <summary>
  /// Excepción que se genera durante el proceso de startup de una aplicación
  /// para detener la inicialización. controlar
  /// </summary>
  public class ExpectedShutdownException : Exception
  {
    /// <inheritdoc cref="Exception" />
    public ExpectedShutdownException()
        : base() { }
    /// <inheritdoc cref="Exception(string?)" />
    public ExpectedShutdownException(string? message)
        : base(message: message) { }
    /// <inheritdoc cref="Exception(string?, Exception?)" />
    public ExpectedShutdownException(string? message, Exception? innerException)
        : base(message: message, innerException: innerException) { }
  }
}
