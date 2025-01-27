import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import {
  ArrayTranslatorModule,
  BsFormCheckboxModule,
  BsFormInputModule,
  DestroySubscriptions,
  StringUtilities,
  keys
} from '@efordevelops/ax-toolbox';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  catchError,
  finalize,
  firstValueFrom,
  startWith,
  takeUntil,
  tap,
  throwError,
  timer
} from 'rxjs';
import {
  AccountLoginRequest,
  LoginModeSettings
} from 'src/app/shared/api/models';
import { AccountService } from 'src/app/shared/api/services';
import {
  ServerSideError
} from 'src/app/shared/interceptors/api-error/api-error.interceptor';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { environment } from 'src/environments/environment';
import { BtnComponent } from '../../btn/btn.component';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    TranslateModule,

    UpperCasePipe,

    BtnComponent,

    BsDropdownModule,

    BsFormInputModule,
    BsFormCheckboxModule,
    ArrayTranslatorModule,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent
  extends DestroySubscriptions
  implements OnDestroy, OnInit {
  readonly _iconLoading = Object.freeze(faSync);

  @Input() returnUrl?: string;
  @Input() extraErrorMessage?: string;

  _isLoadingProviders = true;
  _hasProviderErrors = false;
  _lAuthLabel?: string;
  _errors: any = {};
  /** Indica si se está llevando a cabo una acción de inicio de sesión. */
  _isLoading = false;

  _userData: AccountLoginRequest = {
    password: '',
    username: '',
    rememberMe: false,
  };

  _languages: string[] = [];
  _langCurrent: string;


  oAuthProviders: IOAuthProvider[] = [];

  private $loadProviders = new EventEmitter<void>();
  private $authError = new EventEmitter<void>();
  private $authSuccess = new EventEmitter<void>();


  @Output() authError = this.$authError.pipe(
    takeUntil(this.$onDestroyed),
  );

  @Output() authSuccess = this.$authSuccess.pipe(
    takeUntil(this.$onDestroyed),
  );

  constructor(
    private readonly cdref: ChangeDetectorRef,
    private readonly authSV: AuthService,
    private readonly translate: TranslateService,
    private readonly accSV: AccountService,
    private readonly tokenSV: TokenService,
    private readonly router: Router,
  ) {
    super();

    this.initListeners();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.$authError.complete();
    this.$authSuccess.complete();
    this.$loadProviders.complete();
  }

  ngOnInit(): void {
    this.$loadProviders.next();
  }


  async onFormSubmit(ev: SubmitEvent) {
    if (!ev.isTrusted) { return; }

    this._isLoading = true;
    this._errors = {};
    this.cdref.detectChanges();

    try {
      // this.authWithJwt()
      await this.authWithCookies();
      await this.authSV.refreshAccountProfile();
      this._userData = { password: '', username: '', rememberMe: this._userData.rememberMe };
      this.cdref.detectChanges();

      const angularRoute = this.getReturnUrlTree();
      if (angularRoute) {
        await this.router.navigateByUrl(angularRoute);
      }

      this.$authSuccess.next();
    } catch (err) {
      const errors = {};
      if (err instanceof ServerSideError) {
        const ks = keys(err.errorData ?? {}) as string[];
        for (const key of ks) {
          const keyMessages = err.errorData[key];
          errors[key.toLowerCase()] = keyMessages;
        }
      } else {
        console.error(err);
      }
      this._errors = errors;
      this.$authError.next(this._errors);
    } finally {
      this._isLoading = false;
      this.cdref.detectChanges();
    }
  }

  async setAppLang(code: string) {
    const $obs = this.translate.use(code);
    await firstValueFrom($obs);
  }



  private async authWithJwt() {
    const apiCall = this.accSV.apiAccountTokenPost$Json({ body: this._userData });
    const data = await firstValueFrom(apiCall);
    this.tokenSV.setStoredToken(data);
  }

  private async authWithCookies() {
    const apiCall = this.accSV.apiAccountLoginPost({ body: this._userData });
    await firstValueFrom(apiCall);
  }

  private initListeners() {
    this.initListenersProviderRequest();
    this.initListenersLangs();
  }

  private initListenersProviderRequest() {
    this.$loadProviders.pipe(
      takeUntil(this.$onDestroyed),
    ).subscribe(() => {
      this.initProviders()
        .subscribe(() => { });
    });
  }

  private initListenersLangs() {
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.currentLang, } as LangChangeEvent),
      takeUntil(this.$onDestroyed),
    ).subscribe((ev) => {
      this._languages = this.translate.getLangs();
      this._langCurrent = ev.lang;
    });
  }


  private initProviders() {
    this._isLoadingProviders = true;
    this._lAuthLabel = undefined;
    this.oAuthProviders = [];

    const $task = this.accSV.apiAccountAuthModesGet$Json().pipe(
      takeUntil(this.$loadProviders),
      catchError((err, caught) => {
        this._hasProviderErrors = true;
        console.error(err);

        timer(2000).pipe(
          takeUntil(this.$loadProviders),
          takeUntil(this.$onDestroyed),
        ).subscribe(() => {
          this.$loadProviders.next();
        });

        return throwError(() => err);
      }),
      tap((providers) => {
        this.initProviderLAuth(providers);
        this.initProviderMs(providers);
      }),
      finalize(() => {
        this._isLoadingProviders = false;
      })
    );

    return $task;
  }

  private initProviderLAuth(settings: LoginModeSettings) {
    this._lAuthLabel = (settings.localUserPass?.isEnabled ?? false)
      ? settings.localUserPass.label
      : undefined;
  }

  private initProviderMs(settings: LoginModeSettings) {
    if (settings?.oAuthMicrosoft?.isEnabled !== true) {
      return;
    }

    const angularRoute = this.getReturnUrlTree();
    const returnTo = angularRoute.toString();

    const mockBase = `${location.protocol}//${location.host}`;
    const url = new URL(`${mockBase}${settings.oAuthMicrosoft.apiRootUrl}`);
    if (returnTo) {
      url.searchParams.set('returnTo', returnTo);
    }

    this.oAuthProviders.push({
      url: url.toString().replace(mockBase, environment.apiUrl),
      imgSrc: settings.oAuthMicrosoft.imageUrl,
      label: settings.oAuthMicrosoft.label,
    });
  }

  private getReturnUrlTree() {
    if (StringUtilities.isNullOrWhitespace(this.returnUrl)) {
      return null;
    }

    const redirectTo = this.returnUrl === '/'
      ? '/dashboard'
      : this.returnUrl;

    const angularRoute = this.router.parseUrl(redirectTo);
    return angularRoute;
  }
}

interface SubmitEvent extends Event {
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: HTMLElement;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  path: HTMLElement[];
  returnValue: boolean;
  srcElement: HTMLElement;
  submitter: HTMLButtonElement | HTMLElement;
  target: HTMLFormElement;
  timeStamp: number;
  type: string;
}

interface IOAuthProvider {
  url: string;
  imgSrc: string;
  label: string;
}
