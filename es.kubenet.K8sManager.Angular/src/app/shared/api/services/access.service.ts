/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AccessService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiAccessAccessGet
   */
  static readonly ApiAccessAccessGetPath = '/api/access/access';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAccessAccessGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccessAccessGet$Plain$Response(params?: {
    'p'?: string;

  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, AccessService.ApiAccessAccessGetPath, 'get');
    if (params) {

      rb.query('p', params['p'], {});

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiAccessAccessGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccessAccessGet$Plain(params?: {
    'p'?: string;

  }): Observable<boolean> {

    return this.apiAccessAccessGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAccessAccessGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccessAccessGet$Json$Response(params?: {
    'p'?: string;

  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, AccessService.ApiAccessAccessGetPath, 'get');
    if (params) {

      rb.query('p', params['p'], {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiAccessAccessGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccessAccessGet$Json(params?: {
    'p'?: string;

  }): Observable<boolean> {

    return this.apiAccessAccessGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
