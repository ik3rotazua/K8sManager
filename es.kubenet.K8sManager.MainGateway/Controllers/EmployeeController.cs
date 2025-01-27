using AutoMapper;
using es.kubenet.K8sManager.Business.Core.Services.EmployeeServices;
using es.kubenet.K8sManager.Infraestructure.Database.Entities;
using es.kubenet.K8sManager.Infraestructure.Dto.Employees;
using es.efor.Utilities.General;
using es.efor.Utilities.Linq.Models.Filters;
using es.efor.Utilities.Linq.Models.Sorts;
using es.efor.Utilities.Web.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace es.kubenet.K8sManager.MainGateway.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController : BaseEforController
  {
    private readonly IEmployeeService EmployeeSV;

    public EmployeeController(IAuthorizationService authService, IMapper mapper, IEmployeeService employeeService)
        : base(authService, mapper)
    {
      EmployeeSV = employeeService;
    }


    #region GET
    /// <summary>
    /// Obtiene un empleado con la id seleccionada
    /// </summary>
    /// <param name="id">ID del empleado a buscar</param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDTO>> GetById(Guid id)
    {
      var result = await EmployeeSV.GetByIdAsync(id);
      if (result == null) { return NotFound(); }

      var asView = _mapper.Map<EmployeeDTO>(result);
      return asView;
    }


    [HttpPost("datatable")]
    public async Task<ActionResult<CollectionList<EmployeeDTO>>> GetDatatableAsync(
        [Required, FromBody] IEnumerable<FilterCriteria> filters,
        [Required, FromQuery(Name = "pi")] int pageIndex = 0,
        [Required, FromQuery(Name = "ps")] int pageSize = 20,
        [FromQuery(Name = "sn")] string? sortName = null,
        [FromQuery(Name = "sd")] bool sortDescending = false)
    {
      var sorts = new List<SortCriteria>();

      if (!string.IsNullOrEmpty(sortName))
      {
        sorts.Add(new SortCriteria() { Field = sortName, SortOp = sortDescending ? SortOperator.Descending : SortOperator.Ascending });
      }
      else
      {
        sorts.Add(new SortCriteria() { Field = nameof(Employee.Name), SortOp = SortOperator.Ascending });
        sorts.Add(new SortCriteria() { Field = nameof(Employee.Surname1), SortOp = SortOperator.Ascending });
      }
      var result = await EmployeeSV.GetCollectionListAsync(
          filters: filters, pageIndex: pageIndex, pageSize: pageSize, orderBy: sorts);

      var asView = new CollectionList<EmployeeDTO>(
          _mapper.Map<IEnumerable<Employee>, List<EmployeeDTO>>(result.Items),
          result.Total);

      return asView;
    }
    #endregion

    #region POST
    [HttpPost]
    public async Task<ActionResult<EmployeeDTO>> PostEmployee(
        [Required, FromBody] EmployeeDTO data)
    {
      if (!ModelState.IsValid) { return BadRequest(ModelState); }

      var asDbItem = _mapper.Map<Employee>(data);
      var result = await EmployeeSV.AddEditAsync(asDbItem);

      var asView = _mapper.Map<EmployeeDTO>(result);
      return asView;
    }
    #endregion


  }
}
