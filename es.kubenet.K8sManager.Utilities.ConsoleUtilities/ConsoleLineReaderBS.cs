namespace es.kubenet.K8sManager.Utilities.ConsoleUtilities
{
  /// <summary>
  /// https://stackoverflow.com/a/18342182
  /// </summary>
  public class ConsoleLineReaderBS
  {
    private readonly Thread InputThread = null!;
    private readonly AutoResetEvent GetInput = new(false);
    private readonly AutoResetEvent GotInput = new(false);

    private string? input;

    public ConsoleLineReaderBS()
    {
      InputThread = new(LineReader);
      InputThread.IsBackground = true;
      InputThread.Start();
    }

    public string ReadLine(TimeSpan? timeout)
    {
      if (!timeout.HasValue) timeout = Timeout.InfiniteTimeSpan;

      GetInput.Set();
      bool success = GotInput.WaitOne(timeout.Value);
      if (success && input != null)
      {
        return input;
      }
      else
      {
        throw new TimeoutException("User did not provide input within the timelimit.");
      }
    }


    private void LineReader()
    {
      while (true)
      {
        GetInput.WaitOne();
        input = Console.ReadLine();
        GotInput.Set();
      }
    }
  }
}
