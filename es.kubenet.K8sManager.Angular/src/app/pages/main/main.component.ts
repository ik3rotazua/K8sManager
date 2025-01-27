import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';
import {
  filter,
  debounceTime,
  takeUntil,
  first,
  map
} from 'rxjs/operators';
import {
  AngularUtilities,
  AxBsModalUtilities,
  BsFormAutocompleteComponent,
  BsModalConfirmationMessageComponent,
  BsModalSimpleComponent,
  DestroySubscriptions,
  ILabelAndValue,
  ILayoutMenuItem,
} from '@efordevelops/ax-toolbox';
import {
  AppMenuService
} from 'src/app/shared/services/app-menu/app-menu.service';
import { AccountService } from 'src/app/shared/api/services';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  faBell,
  faChevronDown,
  faEye,
  faHistory,
  faPowerOff,
  faSync,
  faThumbtack,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';


type This = MainComponent;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent
  extends DestroySubscriptions
  implements OnInit {
  @ViewChild('modalTomatoTimer') modalTomatoTimer: BsModalSimpleComponent;
  @ViewChild('modalLogout') modalLogout: BsModalConfirmationMessageComponent;
  @ViewChild('modalNotificationDetails') modalNotificationDetails: BsModalConfirmationMessageComponent;

  _menuItems: ILayoutMenuItem[] = [];
  _menuOpenned = false;

  _iconLogout = faPowerOff;

  userName = '';
  //userAvatarSrc?= `${environment.apiUrl}${AccountService.ApiAccountPictureGetPath}`;
  userAvatarSrc = null;

  readonly _iconTimer = Object.freeze(faHistory);
  readonly _iconChevronDown = Object.freeze(faChevronDown);
  readonly _iconSignOut = Object.freeze(faPowerOff);
  readonly _iconNotifications = Object.freeze(faBell);
  readonly _iconLoading = Object.freeze(faSync);
  readonly _iconClose = Object.freeze(faTimes);
  readonly _iconEye = Object.freeze(faEye);
  readonly _iconPinned = Object.freeze(faThumbtack);


  _currentLang = this.translate.currentLang;
  _languages: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly menuService: AppMenuService,
    private readonly translate: TranslateService,
    private readonly authSV: AuthService,
    private readonly acctSV: AccountService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initAuthListener();
    this.initTranslate();
    this.initMenuItems();
    this.initRouterListeners();
  }

  async onBtnClickTomatoTimer() {
    this.modalTomatoTimer.open();
  }

  async onBtnClickLogout() {
    await AxBsModalUtilities.waitUntilClose(
      this.modalLogout,
      async () => {
        this.router.navigate(['/auth/logout']);
      },
      async () => { },
    );
  }

  async setAppLang(code: string) {
    const obs = this.translate.use(code);
    await firstValueFrom(obs);
  }


  private async initMenuItems() {
    const data = await this.menuService.getMenuItems();
    this._menuItems = data;
  }

  private initRouterListeners() {
    this.router.events
      .pipe(
        takeUntil(this.$onDestroyed),
        filter(e => e instanceof NavigationStart), debounceTime(100)
      )
      .subscribe((data) => {
        this._menuOpenned = false;
      });
  }

  private initAuthListener() {
    this.authSV.$profileChange
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe((profile) => {
        this.userName = profile?.displayName ?? '???';
      });
  }

  private initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe((data) => {
        this._currentLang = data.lang;
      });
    this._languages = this.translate.getLangs();
  }
}
