import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router
} from '@angular/router';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import {
  AngularUtilities,
  AxRouteData,
  BreadcrumbService,
  DestroySubscriptions,
  timeoutPromise,
} from '@efordevelops/ax-toolbox';
import { setTheme } from 'ngx-bootstrap/utils';
import {
  filter,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  ServiceWorkerService
} from './shared/services/service-worker/service-worker.service';
import {
  MetadataRobotConfiguration,
  SeoService
} from './shared/services/seo/seo.service';
import {
  AppViewportService
} from './shared/services/app-viewport/app-viewport.service';
import {
  RouteHelperService
} from './shared/services/route-helper/route-helper.service';
import { of } from 'rxjs';

const TIMEOUT_MS_ANIMATION_FADEOUT = 300;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
  extends DestroySubscriptions
  implements OnInit, AfterViewInit {
  _showUpdateDialog = false;
  _updateAvailable = false;
  _updateInProgress = false;
  _isReady = false;

  iconLoading = faSync;
  constructor(
    private readonly swSV: ServiceWorkerService,
    private readonly seoSV: SeoService,
    private readonly router: Router,
    private readonly routerHelper: RouteHelperService,
    private readonly aRoute: ActivatedRoute,
    private readonly appVpSV: AppViewportService,
    private readonly bcSV: BreadcrumbService,
  ) {
    super();
    setTheme('bs5');
    this.routerHelper.init();
  }
  ngOnInit() {
    this.appVpSV.init();
    this.initServiceWorkerListener();
    this.initRouterListener();
  }

  async ngAfterViewInit() {
    await AngularUtilities.waitLifecycle();
    this._isReady = true;
  }

  private initServiceWorkerListener() {
    this.swSV.onUpdateAvailable
      .pipe(
        takeUntil(this.$onDestroyed)
      )
      .subscribe((isUpdateAvailable) => {
        this._updateAvailable = isUpdateAvailable;
        this._showUpdateDialog = this._updateAvailable;
      });
    this.swSV.onUpdateInProgress
      .pipe(
        takeUntil(this.$onDestroyed)
      )
      .subscribe((isInprogress) => {
        this._updateInProgress = isInprogress;
      });
  }

  async onUpdateAccept(ev: MouseEvent) {
    if (!ev.isTrusted) { return; }

    this._updateAvailable = false;
    await this.swSV.updateApp();
    this._showUpdateDialog = false;
  }

  async onUpdateDecline(ev: MouseEvent) {
    if (!ev.isTrusted) { return; }

    this._updateAvailable = false;
    await timeoutPromise(TIMEOUT_MS_ANIMATION_FADEOUT);
    this._showUpdateDialog = false;
  }

  private initRouterListener() {
    this.router.events
      .pipe(
        takeUntil(this.$onDestroyed),
        filter(ev => ev instanceof NavigationEnd)
      )
      .subscribe((ev: NavigationEnd) => {
        this.bcSV.$onBreadcrumbChange
          .pipe(
            takeUntil(this.$onDestroyed),
            map((bcs) => (bcs?.length ?? 0) === 0
              ? null
              : bcs[bcs.length - 1]),
            switchMap((br) => br == null
              ? this.router.events.pipe(
                takeUntil(this.$onDestroyed),
                filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd))
              : of(br)))
          .subscribe((item) => {
            if (item instanceof NavigationEnd) {
              const route = this.getFurthestSnapshot(this.aRoute);
              const breadcrumb = (route.data as AxRouteData)?.breadcrumb;
              this.seoSV.setMetadata({
                Title: breadcrumb?.label,
              }, [MetadataRobotConfiguration.None]);
            } else {
              this.seoSV.setMetadata({
                Title: item.label,
              }, [MetadataRobotConfiguration.None]);
            }
          });
      });
  }

  private getFurthestSnapshot(aRoute: ActivatedRoute): ActivatedRouteSnapshot {
    const route = aRoute.snapshot;
    const child = aRoute.firstChild;
    if (child) {
      return this.getFurthestSnapshot(child);
    }

    return route;
  }
}
