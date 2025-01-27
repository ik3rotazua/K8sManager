import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {
  firstValueFrom,
  from,
  Observable
} from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Injectable()
export class ApiHeaderJwtInterceptor implements HttpInterceptor {

  constructor(
    public tokenSV: TokenService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.handleRequest(request, next));
  }


  private async handleRequest(request: HttpRequest<unknown>, next: HttpHandler) {
    const token = await this.tokenSV.getStoredToken();
    if (token && token.accessToken && request.url.startsWith('/')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        withCredentials: true,
      });
    }

    return firstValueFrom(next.handle(request));
  }
}
