import { Injectable, Injector } from '@angular/core';
import { HttpStatusCodes, SetData } from '@efordevelops/ax-toolbox';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {
  Observable,
  from,
  throwError
} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  CustomIndividualConfig,
  ToastrCustomService
} from '../../_third-party/ep-components/components/toastr-custom/service/toastr-custom.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlug, faUnlink } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../api/services';
import {
  AuthModalComponent
} from '../../components/modals/auth-modal/auth-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

/**
 * Lista de URLs que se deben ignorar al interceptar errores de API.
 * Estas URLs no serán interceptadas por el interceptor de errores.
 */
const IGNORED_URLS = Object.freeze([
  // La URL de auth-modes no necesita interceptar el error,
  // ya que se controla el error en la única llamada que se
  // debe hacer en toda la app; en la página de login.
  `${environment.apiUrl ?? ''}${AccountService.ApiAccountAuthModesGetPath}`,
]);

@Injectable()
export class ApiErrorInterceptor
implements HttpInterceptor {
  private toastSV: ToastrCustomService;
  private translateSV: TranslateService;

  constructor(
    private injector: Injector,
  ) {
    this.toastSV = this.injector.get(ToastrCustomService);
    this.translateSV = this.injector.get(TranslateService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error, caught) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === HttpStatusCodes.Unauthorized) {
            const $obs = from(this.handleServerStatus401(error)).pipe(
              switchMap((isLogged) => {
                if (isLogged) {
                  return caught;
                }

                return throwError(() => error);
              }),
            );

            return $obs;
          }
        }

        return throwError(() => error);
      }),
      catchError((error, caught) => {
        // if (error instanceof ErrorEvent) { }
        if (error instanceof HttpErrorResponse) {
          const func = this.getErrorHandler(error);
          if (func) {
            const errorMessage = func(error, request);

            if (errorMessage && errorMessage.toastData && (errorMessage.toastData.title || errorMessage.toastData.message)) {
              const config: Partial<CustomIndividualConfig> = { extendedTimeOut: 4000 };
              if (errorMessage.toastData.isHtml) { config.enableHtml = true; }
              if (errorMessage.toastData.icon) {
                config.icon = errorMessage.toastData.icon;
              }
              // if (errorMessage.iconCssClass) config = {icon};
              if (!IGNORED_URLS.includes(request.url)) {
                this.toastSV.error(errorMessage.toastData.message, errorMessage.toastData.title, config);
              }
            }
            if (errorMessage) {
              return throwError(() => errorMessage);
            } else {
              return throwError(() => error);
            }
          }
        }

        return throwError(() => error);
      }));
  }

  private getErrorHandler(response: HttpErrorResponse) {
    switch (response.status) {
      case 0:
        return this.handleServerStatus0.bind(this);
      case HttpStatusCodes.BadRequest:
        return this.handleServerStatus400.bind(this);
      case HttpStatusCodes.NotFound:
        return this.handleServerStatus404.bind(this);
      case HttpStatusCodes.InternalServerError:
        return this.handleServerStatus500.bind(this);
    }
  }


  private handleServerStatus0(error: HttpErrorResponse) {
    return new ServerSideError(error).setData({
      toastData: new ErrorAsToast({
        icon: faPlug,
        title: this.translateSV.instant('API.ERROR.STATUSCODE.0.TITLE'),
        message: this.translateSV.instant('API.ERROR.STATUSCODE.0.BODY'),
      }),
    });
  }

  private handleServerStatus400(error: HttpErrorResponse) {
    const err = this.handleServerStatusGeneric(error);
    return err;
  }

  private handleServerStatus404(error: HttpErrorResponse) {
    const err = this.handleServerStatusGeneric(error);
    return err;
  }

  private async handleServerStatus401(error: HttpErrorResponse) {
    try {
      const sv = this.injector.get(BsModalService);
      const mRef = sv.show(AuthModalComponent);
      const modal = mRef.content;
      const isLoggedIn = await modal.openAsync();
      mRef.hide();
      return isLoggedIn;
    } catch (e) {
      return false;
    }
  }

  private handleServerStatus500(error: HttpErrorResponse, request: HttpRequest<any>) {
    const err = this.handleServerStatusGeneric(error) || new ServerSideError(error);
    if (!err.toastData || (!err.toastData.message && !err.toastData.title)) {
      if (!err.toastData) { err.setData({ toastData: new ErrorAsToast(), }); }

      err.toastData.setData({
        icon: faUnlink,
        title: this.translateSV.instant('API.ERROR.STATUSCODE.500.TITLE'),
        message: this.translateSV.instant('API.ERROR.STATUSCODE.500.BODY'),
      });
    }
    return err;
  }

  private handleServerStatusGeneric(error: HttpErrorResponse) {
    let parsed: ServerSideError = null;
    if (error.error) {
      try {
        let asObj: any = null;
        if (typeof (error.error) === 'string') {
          asObj = JSON.parse(error.error);
        } else if (typeof (error.error) === 'object') {
          asObj = error.error;
        }

        if (asObj && typeof (asObj.errors) === 'object' && !Array.isArray(asObj.errors)) {
          asObj = asObj.errors;
        }

        parsed = new ServerSideError(error);
        parsed.errorData = asObj;
        if (typeof (asObj) === 'string') { parsed.toastData.title = error.error; }
        else {
          if (asObj) {
            if (asObj._title) {
              if (asObj._title instanceof (Array)) {
                parsed.toastData.isHtml = true;
                parsed.toastData.title = (asObj._title as string[])
                  .map((key) => this.tryTranslate(key))
                  .join('<br>');
              }
              else if (typeof (asObj._title) === 'string') {
                parsed.toastData.message = this.tryTranslate(asObj._title);
              }
            }
            if (asObj._message) {
              if (asObj._message instanceof (Array)) {
                parsed.toastData.message = (asObj._message as string[])
                  .map((key) => this.tryTranslate(key) ?? key)
                  .join('<br>');
                parsed.toastData.isHtml = true;
              }
              else if (typeof (asObj._message) === 'string') {
                parsed.toastData.message = this.tryTranslate(asObj._message);
              }
            }
          }
        }
      }
      catch (e) { }
    }

    if (parsed) {
      parsed.setData({
        statusCode: error.status,
        statusText: error.statusText,
        errorMessage: error.message,
      });
    }
    return parsed;
  }

  private tryTranslate(input: string) {
    if (input == null) { return input; }

    const out = this.translateSV.instant(input);
    if (out === input.toUpperCase()) {
      return input;
    }

    return out;
  }
}

type ServerSideErrorHandler = (error: HttpErrorResponse, request: HttpRequest<any>) => ServerSideError;
class ErrorAsToast
  extends SetData<ErrorAsToast> {
  title: string;
  message: string;
  isHtml = false;
  icon: IconProp;

  constructor(newData?: Partial<ErrorAsToast>) {
    super();
    this.setData(newData);
  }
}
export class ServerSideError
  extends SetData<ServerSideError> {
  toastData: ErrorAsToast = new ErrorAsToast();
  errorData: { [key: string]: string[] };
  statusCode: HttpStatusCodes | 0;
  statusText?: string;
  errorMessage?: string;

  constructor(error: HttpErrorResponse) {
    super();
    this.statusCode = error.status;
    this.statusText = error.statusText;
    this.errorMessage = error.message;
  }

  toString() {
    let msg = `Server side report:\n[${this.statusCode}] ${this.statusText}: ${this.errorMessage}.`;
    if (this.toastData && this.toastData.title) { msg += `\n${this.toastData.title}`; }
    if (this.toastData && this.toastData.message) { msg += `\n${this.toastData.message}`; }
    return msg;
  }
}
