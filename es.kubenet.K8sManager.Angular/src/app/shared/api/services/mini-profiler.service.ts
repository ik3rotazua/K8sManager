/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ListResultsOrder } from '../models/list-results-order';
import { MiniProfiler } from '../models/mini-profiler';

@Injectable({
  providedIn: 'root',
})
export class MiniProfilerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiMiniprofilerGet
   */
  static readonly ApiMiniprofilerGetPath = '/api/miniprofiler';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMiniprofilerGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerGet$Plain$Response(params: {
    pSize: number;
    dtFrom?: string;
    dtTo?: string;
    sd?: ListResultsOrder;

  }): Observable<StrictHttpResponse<Array<MiniProfiler>>> {

    const rb = new RequestBuilder(this.rootUrl, MiniProfilerService.ApiMiniprofilerGetPath, 'get');
    if (params) {

      rb.query('pSize', params.pSize, {});
      rb.query('dtFrom', params.dtFrom, {});
      rb.query('dtTo', params.dtTo, {});
      rb.query('sd', params.sd, {});

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MiniProfiler>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiMiniprofilerGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerGet$Plain(params: {
    pSize: number;
    dtFrom?: string;
    dtTo?: string;
    sd?: ListResultsOrder;

  }): Observable<Array<MiniProfiler>> {

    return this.apiMiniprofilerGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MiniProfiler>>) => r.body as Array<MiniProfiler>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMiniprofilerGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerGet$Json$Response(params: {
    pSize: number;
    dtFrom?: string;
    dtTo?: string;
    sd?: ListResultsOrder;

  }): Observable<StrictHttpResponse<Array<MiniProfiler>>> {

    const rb = new RequestBuilder(this.rootUrl, MiniProfilerService.ApiMiniprofilerGetPath, 'get');
    if (params) {

      rb.query('pSize', params.pSize, {});
      rb.query('dtFrom', params.dtFrom, {});
      rb.query('dtTo', params.dtTo, {});
      rb.query('sd', params.sd, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MiniProfiler>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiMiniprofilerGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerGet$Json(params: {
    pSize: number;
    dtFrom?: string;
    dtTo?: string;
    sd?: ListResultsOrder;

  }): Observable<Array<MiniProfiler>> {

    return this.apiMiniprofilerGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MiniProfiler>>) => r.body as Array<MiniProfiler>)
    );
  }

  /**
   * Path part for operation apiMiniprofilerIdGet
   */
  static readonly ApiMiniprofilerIdGetPath = '/api/miniprofiler/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMiniprofilerIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerIdGet$Plain$Response(params: {
    id: string;

  }): Observable<StrictHttpResponse<MiniProfiler>> {

    const rb = new RequestBuilder(this.rootUrl, MiniProfilerService.ApiMiniprofilerIdGetPath, 'get');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MiniProfiler>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiMiniprofilerIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerIdGet$Plain(params: {
    id: string;

  }): Observable<MiniProfiler> {

    return this.apiMiniprofilerIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<MiniProfiler>) => r.body as MiniProfiler)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMiniprofilerIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerIdGet$Json$Response(params: {
    id: string;

  }): Observable<StrictHttpResponse<MiniProfiler>> {

    const rb = new RequestBuilder(this.rootUrl, MiniProfilerService.ApiMiniprofilerIdGetPath, 'get');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MiniProfiler>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiMiniprofilerIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMiniprofilerIdGet$Json(params: {
    id: string;

  }): Observable<MiniProfiler> {

    return this.apiMiniprofilerIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<MiniProfiler>) => r.body as MiniProfiler)
    );
  }

}
