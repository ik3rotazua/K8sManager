/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { EmployeeDto } from '../models/employee-dto';
import { EmployeeDtoCollectionList } from '../models/employee-dto-collection-list';
import { FilterCriteria } from '../models/filter-criteria';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiEmployeeIdGet
   */
  static readonly ApiEmployeeIdGetPath = '/api/employee/{id}';

  /**
   * Obtiene un empleado con la id seleccionada.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeeIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiEmployeeIdGet$Plain$Response(params: {

    /**
     * ID del empleado a buscar
     */
    id: string;

  }): Observable<StrictHttpResponse<EmployeeDto>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeeIdGetPath, 'get');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDto>;
      })
    );
  }

  /**
   * Obtiene un empleado con la id seleccionada.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeeIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiEmployeeIdGet$Plain(params: {

    /**
     * ID del empleado a buscar
     */
    id: string;

  }): Observable<EmployeeDto> {

    return this.apiEmployeeIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDto>) => r.body as EmployeeDto)
    );
  }

  /**
   * Obtiene un empleado con la id seleccionada.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeeIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiEmployeeIdGet$Json$Response(params: {

    /**
     * ID del empleado a buscar
     */
    id: string;

  }): Observable<StrictHttpResponse<EmployeeDto>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeeIdGetPath, 'get');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDto>;
      })
    );
  }

  /**
   * Obtiene un empleado con la id seleccionada.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeeIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiEmployeeIdGet$Json(params: {

    /**
     * ID del empleado a buscar
     */
    id: string;

  }): Observable<EmployeeDto> {

    return this.apiEmployeeIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDto>) => r.body as EmployeeDto)
    );
  }

  /**
   * Path part for operation apiEmployeeDatatablePost
   */
  static readonly ApiEmployeeDatatablePostPath = '/api/employee/datatable';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeeDatatablePost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeeDatatablePost$Plain$Response(params: {
    pi: number;
    ps: number;
    sn?: string;
    sd?: boolean;
      body: Array<FilterCriteria>
  }): Observable<StrictHttpResponse<EmployeeDtoCollectionList>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeeDatatablePostPath, 'post');
    if (params) {

      rb.query('pi', params.pi, {});
      rb.query('ps', params.ps, {});
      rb.query('sn', params.sn, {});
      rb.query('sd', params.sd, {});

      rb.body(params.body, 'application/*+json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDtoCollectionList>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeeDatatablePost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeeDatatablePost$Plain(params: {
    pi: number;
    ps: number;
    sn?: string;
    sd?: boolean;
      body: Array<FilterCriteria>
  }): Observable<EmployeeDtoCollectionList> {

    return this.apiEmployeeDatatablePost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDtoCollectionList>) => r.body as EmployeeDtoCollectionList)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeeDatatablePost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeeDatatablePost$Json$Response(params: {
    pi: number;
    ps: number;
    sn?: string;
    sd?: boolean;
      body: Array<FilterCriteria>
  }): Observable<StrictHttpResponse<EmployeeDtoCollectionList>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeeDatatablePostPath, 'post');
    if (params) {

      rb.query('pi', params.pi, {});
      rb.query('ps', params.ps, {});
      rb.query('sn', params.sn, {});
      rb.query('sd', params.sd, {});

      rb.body(params.body, 'application/*+json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDtoCollectionList>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeeDatatablePost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeeDatatablePost$Json(params: {
    pi: number;
    ps: number;
    sn?: string;
    sd?: boolean;
      body: Array<FilterCriteria>
  }): Observable<EmployeeDtoCollectionList> {

    return this.apiEmployeeDatatablePost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDtoCollectionList>) => r.body as EmployeeDtoCollectionList)
    );
  }

  /**
   * Path part for operation apiEmployeePost
   */
  static readonly ApiEmployeePostPath = '/api/employee';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeePost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeePost$Plain$Response(params: {
      body: EmployeeDto
  }): Observable<StrictHttpResponse<EmployeeDto>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeePostPath, 'post');
    if (params) {


      rb.body(params.body, 'application/*+json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeePost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeePost$Plain(params: {
      body: EmployeeDto
  }): Observable<EmployeeDto> {

    return this.apiEmployeePost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDto>) => r.body as EmployeeDto)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiEmployeePost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeePost$Json$Response(params: {
      body: EmployeeDto
  }): Observable<StrictHttpResponse<EmployeeDto>> {

    const rb = new RequestBuilder(this.rootUrl, EmployeeService.ApiEmployeePostPath, 'post');
    if (params) {


      rb.body(params.body, 'application/*+json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EmployeeDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiEmployeePost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiEmployeePost$Json(params: {
      body: EmployeeDto
  }): Observable<EmployeeDto> {

    return this.apiEmployeePost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<EmployeeDto>) => r.body as EmployeeDto)
    );
  }

}
