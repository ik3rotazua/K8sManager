namespace es.kubenet.K8sManager.Database.Models.Constants
{
  public static class ConsoleArgs
  {
    /// <summary>
    /// Valores: true/false.
    /// <br></br>
    /// Se utiliza para determinar si la aplicación se está ejecutando como
    /// parte de una tarea automatizada y, por lo tanto, no debe arrancar
    /// la parte de la API. La aplicación deberá detenerse sin producir
    /// errores una vez termine su arranque inicial.
    /// </summary>
    public const string CONSOLE_ARG_IS_PIPELINE = "pipeline";
    /// <summary>
    /// Valores: true/false.
    /// <br></br>
    /// Se utiliza para determinar si se debe confirmar al usuario la aplicación
    /// de migraciones pendientes a la base de datos. Si no existen migraciones
    /// pendientes de aplicar, se ignora este elemento.
    /// </summary>
    public const string CONSOLE_ARG_ASK_PENDING_MIGRATIONS = "askPendingMigrations";
  }
}
