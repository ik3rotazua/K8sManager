import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router
} from '@angular/router';
import {
  catchError,
  finalize,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { AccountService } from 'src/app/shared/api/services';
import {
  ServerSideError
} from 'src/app/shared/interceptors/api-error/api-error.interceptor';
import {
  MetadataRobotConfiguration,
  SeoService
} from 'src/app/shared/services/seo/seo.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  AngularUtilities,
  DestroySubscriptions,
  StringUtilities,
  keys
} from '@efordevelops/ax-toolbox';
import { generate } from 'geopattern';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {
  AccountLoginRequest,
  LoginModeSettings
} from 'src/app/shared/api/models';
import {
  firstValueFrom,
  throwError,
  timer
} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent
  extends DestroySubscriptions
  implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex align-items-center bg-gradient-blue';

  _backgroundImg: string;

  _errorMessage?: string;
  _returnUrl?: string;

  private classStyleElement: HTMLElement;

  constructor(
    private readonly aRoute: ActivatedRoute,
    private readonly seo: SeoService,
    private readonly translate: TranslateService,
  ) {
    super();
    this.initBackground();
    this.initListenersRoutes();

    this.seo.clearMetadata();
    this.seo.setMetadata({}, [MetadataRobotConfiguration.None]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  private initListenersRoutes() {
    AngularUtilities.activatedRouteChange(this.aRoute)
      .pipe(
        takeUntil(this.$onDestroyed)
      )
      .subscribe(({ data, fragment, paramMap, queryParamMap }) => {
        this._errorMessage = (queryParamMap.get('errMsg') ?? null)
          ?.replace('\n', '<br>');
        this._returnUrl = this.getReturnUrl(queryParamMap);
      });
  }

  private getReturnUrl(qParams: ParamMap) {
    const qp = qParams.get('ReturnUrl');
    if (StringUtilities.isNullOrWhitespace(qp)) { return '/dashboard'; }
    if (/^Route\(/gim.test(qp)) { return '/dashboard'; }

    return qp;
  }

  private initBackground() {
    this.classStyleElement = document.createElement('div');
    this.classStyleElement.classList.add('bg-info');
    this.classStyleElement.style.display = 'none';
    document.body.append(this.classStyleElement);
    const rgba = getComputedStyle(this.classStyleElement).backgroundColor;
    this.classStyleElement.remove();
    this.classStyleElement = undefined;
    const hex = `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) => (i === 3
        ? Math.round(parseFloat(n) * 255)
        : parseFloat(n))
        .toString(16)
        .padStart(2, '0')
        .replace('NaN', ''))
      .join('')}`;

    const appName = this.translate.instant('APP_NAME');
    this._backgroundImg = generate(appName, { color: hex }).toDataUrl();
  }
}
