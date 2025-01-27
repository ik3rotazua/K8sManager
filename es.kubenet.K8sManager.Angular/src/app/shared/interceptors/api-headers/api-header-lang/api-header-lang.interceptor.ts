import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DictionaryService
} from 'src/app/shared/services/dictionary/dictionary.service';

@Injectable()
export class ApiHeaderLangInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (DictionaryService.currentLanguage) {
      const clone = request.clone({
        headers: request.headers
          .set('lang', DictionaryService.currentLanguage),
      });
      return next.handle(clone);
    } else {
      return next.handle(request);
    }
  }
}
