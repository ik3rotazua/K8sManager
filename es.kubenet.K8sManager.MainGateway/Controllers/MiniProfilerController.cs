using AutoMapper;
using es.efor.Auth.Models.Entities;
using es.efor.Utilities.Web.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Profiling.Storage;
using StackExchange.Profiling;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Threading;
using System;
using System.Linq;
using es.kubenet.K8sManager.Auth.Models;

namespace es.kubenet.K8sManager.MainGateway.Controllers
{
  [Authorize(Roles = RoleNames.ROLE_ADMIN)]
  [Route("api/[controller]")]
  [ApiController]
  public class MiniProfilerController(
      IAuthorizationService authSV,
      IMapper mapper)
    : BaseEforController(authSV, mapper)
  {
    private IAsyncStorage MPStorage = MiniProfiler.DefaultOptions.Storage;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IEnumerable<MiniProfiler>> GetList(
        [FromQuery(Name = "pSize"), Required, Range(ushort.MinValue, ushort.MaxValue)] ushort pSize = 0,
        [FromQuery(Name = "dtFrom")] DateTimeOffset? dtFrom = null,
        [FromQuery(Name = "dtTo")] DateTimeOffset? dtTo = null,
        [FromQuery(Name = "sd")] ListResultsOrder sortDirection = ListResultsOrder.Descending,
        CancellationToken cancelToken = default
        )
    {
      DateTime? start = dtFrom.HasValue
              ? dtFrom.Value.LocalDateTime
              : null;
      DateTime? finish = dtTo.HasValue
              ? dtTo.Value.LocalDateTime
              : null;

      var ids = await MPStorage.ListAsync(
          maxResults: pSize,
          start: start,
          finish: finish,
          orderBy: sortDirection);
      //.WithCancellation(cancelToken);

      cancelToken.ThrowIfCancellationRequested();
      var itemTasks = ids
          .Select(MPStorage.LoadAsync);//.WithCancellation(cancelToken));

      cancelToken.ThrowIfCancellationRequested();
      var items = (await Task.WhenAll(itemTasks)
        ?? [])
        .Where(i => i != null)
        .Cast<MiniProfiler>()
        .ToList();
      //.WithCancellation(cancelToken);

      cancelToken.ThrowIfCancellationRequested();

      return items;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MiniProfiler>> SetAsViewed(
        [Required] Guid id,
        CancellationToken cancelToken = default)
    {
      if (!(User?.Identity?.IsAuthenticated ?? false))
      {
        return Unauthorized();
      }

      var profile = await MPStorage.LoadAsync(id);
      //.WithCancellation(cancelToken);

      cancelToken.ThrowIfCancellationRequested();

      if (profile == null) { return NotFound(); }
      await MPStorage.SetViewedAsync(User.Identity.Name, id);
      //.WithCancellation(cancelToken);

      return profile;
    }
  }
}
