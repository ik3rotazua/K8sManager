import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';

@Injectable()
export class ApiCookiesCorsInterceptor implements HttpInterceptor {
  apiConfig: ApiConfiguration;
  constructor(
    private readonly inject: Injector,
  ) {
    this.apiConfig = inject.get<ApiConfiguration>(ApiConfiguration);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiUrl = this.apiConfig?.rootUrl ?? '';
    const reqUrl = request.url;

    if (reqUrl.startsWith(apiUrl)) {
      request = request.clone({
        withCredentials: true,
      });
    }

    return next.handle(request);
  }
}
