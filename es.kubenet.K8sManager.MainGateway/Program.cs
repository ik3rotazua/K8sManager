using es.efor.Logging.Serilog.Extensions;
using es.kubenet.K8sManager.MainGateway;
using es.kubenet.K8sManager.Utilities.ConsoleUtilities.Models;
using es.efor.Utilities.General.Tools;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using System;


var INSTANCE_IDENTIFIER = Guid.NewGuid();
var INSTANCE_HOSTNAME = NetworkInterfaceUtils.GetNetworkInformation(null, null).HostName;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables("APP_");

var startup = new Startup(
    builder.Configuration,
    builder.Environment,
    INSTANCE_IDENTIFIER,
    INSTANCE_HOSTNAME
    );
startup.ConfigureServices(
    builder.Services);
builder.Host.UseEforSerilog<Program>(
    DateTimeOffset.UtcNow,
    INSTANCE_IDENTIFIER.ToString(),
    INSTANCE_HOSTNAME
    );

var app = builder.Build();
startup.Configure(
    app,
    app.Logger,
    builder.Configuration);

try
{
  app.Run();
}
catch (ExpectedShutdownException ex)
{
  System.Threading.Thread.Sleep(TimeSpan.FromSeconds(1));
  Console.WriteLine("");
  Console.WriteLine("");

  Console.BackgroundColor = ConsoleColor.DarkBlue;
  Console.ForegroundColor = ConsoleColor.White;
  Console.WriteLine(ex.Message);
  Console.ResetColor();
}
catch (Exception)
{
  throw;
}
