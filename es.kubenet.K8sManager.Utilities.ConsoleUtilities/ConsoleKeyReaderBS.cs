namespace es.kubenet.K8sManager.Utilities.ConsoleUtilities
{
  /// <summary>
  /// https://stackoverflow.com/a/18342182
  /// </summary>
  public class ConsoleKeyReaderBS
  {
    private readonly Thread InputKeyThread;
    private readonly AutoResetEvent GetInput, GotInput;

    private ConsoleKeyInfo inputKey;

    public ConsoleKeyReaderBS()
    {
      GetInput = new AutoResetEvent(false);
      GotInput = new AutoResetEvent(false);

      InputKeyThread = new Thread(KeyReader);
      InputKeyThread.IsBackground = true;
      InputKeyThread.Start();
    }

    public ConsoleKey ReadKey(TimeSpan? timeout)
    {
      if (!timeout.HasValue) timeout = Timeout.InfiniteTimeSpan;

      GetInput.Set();
      bool success = GotInput.WaitOne(timeout.Value);
      if (success)
        return inputKey.Key;
      else
        throw new TimeoutException("User did not provide input within the timelimit.");
    }

    private void KeyReader()
    {
      while (true)
      {
        GetInput.WaitOne();
        inputKey = Console.ReadKey(false);
        GotInput.Set();
      }
    }
  }
}
