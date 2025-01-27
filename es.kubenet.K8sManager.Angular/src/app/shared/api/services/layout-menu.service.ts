/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { LayoutMenuItem } from '../models/layout-menu-item';

@Injectable({
  providedIn: 'root',
})
export class LayoutMenuService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiAppLayoutmenuGet
   */
  static readonly ApiAppLayoutmenuGetPath = '/api/app/layoutmenu';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAppLayoutmenuGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAppLayoutmenuGet$Plain$Response(params?: {

  }): Observable<StrictHttpResponse<Array<LayoutMenuItem>>> {

    const rb = new RequestBuilder(this.rootUrl, LayoutMenuService.ApiAppLayoutmenuGetPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LayoutMenuItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiAppLayoutmenuGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAppLayoutmenuGet$Plain(params?: {

  }): Observable<Array<LayoutMenuItem>> {

    return this.apiAppLayoutmenuGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<LayoutMenuItem>>) => r.body as Array<LayoutMenuItem>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAppLayoutmenuGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAppLayoutmenuGet$Json$Response(params?: {

  }): Observable<StrictHttpResponse<Array<LayoutMenuItem>>> {

    const rb = new RequestBuilder(this.rootUrl, LayoutMenuService.ApiAppLayoutmenuGetPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LayoutMenuItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiAppLayoutmenuGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAppLayoutmenuGet$Json(params?: {

  }): Observable<Array<LayoutMenuItem>> {

    return this.apiAppLayoutmenuGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<LayoutMenuItem>>) => r.body as Array<LayoutMenuItem>)
    );
  }

}
