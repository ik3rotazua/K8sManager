import { EventEmitter, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  ParamMap,
  Router
} from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  takeUntil
} from 'rxjs/operators';
import {
  AngularUtilities,
  AxRouteData,
  BRADCRUMB_ROUTE_SEPARATOR,
  DestroySubscriptions,
  IBreadcrumb,
  StringUtilities
} from '@efordevelops/ax-toolbox';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbCustomService
  extends DestroySubscriptions {
  private readonly $bcChange = new BehaviorSubject<IBreadcrumb[]>([]);
  private readonly $cancelBcListeners = new EventEmitter<void>();

  $onBreadcrumbChange = this.$bcChange
    .pipe(
      takeUntil(this.$onDestroyed)
    );

  constructor(
    private readonly router: Router,
    private readonly aRoute: ActivatedRoute,
    private readonly translate: TranslateService,
  ) {
    super();
    this.initListener();
  }

  private initListener() {
    // We only perform the actions regarding events if:
    const $routerChanged = this.router.events
      .pipe(
        // The service has not been destroyed
        takeUntil(this.$onDestroyed),
        // The event emitted is the navigation end
        // (guards and failed navigations are of no interest
        // because the user has yet to move from the page)
        filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd),
        // A little bit tricky: we only continue if we're not navigating
        // to the same page. The pipe inverts the logic because it's looking
        // for a boolean value that tells them if the navigation is the same
        // (positive boolean value, 'isChanged').
        distinctUntilChanged((a, b) => a === b || a?.url === b?.url));

    $routerChanged
      .subscribe(() => {
        this.$cancelBcListeners.next();
        // Cuando termina una navegación, lee todos los componentes
        // heredados que se han cargado según las rutas que se han seguido.
        const breadcrumbs = this.extractBreadcrumbs(this.aRoute);
        this.$bcChange.next(breadcrumbs);
      });
  }

  private extractBreadcrumbs(aRoute: ActivatedRoute) {
    const breadcrumbs: IBreadcrumb[] = [];
    const snap = aRoute.snapshot;
    const data: AxRouteData = snap.data;
    const dataBreadcrumb: (typeof data)['breadcrumb'] & { translate?: boolean; } = data?.breadcrumb;

    if (dataBreadcrumb) {
      const parentData: AxRouteData = snap.parent?.data;
      const isParentBreadcrumb = dataBreadcrumb === parentData?.breadcrumb;


      if (!isParentBreadcrumb) {
        const breadcrumbLabel = dataBreadcrumb.label;
        const breadcrumbLabelTranslate = dataBreadcrumb.translate ?? false;

        const breadcrumb: IBreadcrumb = {
          label: '',
          url: this.extractBreadcrumbUrl(snap),
          urlConfigured: this.extractBreadcrumbUrlConfigured(snap),
          snapParams: snap.params,
          icon: dataBreadcrumb.icon,
        };
        breadcrumbs.push(breadcrumb);

        combineLatest([
          AngularUtilities.activatedRouteChange(aRoute),
          this.translate.onLangChange.pipe(startWith({
            lang: this.translate.currentLang,
            translations: this.translate.translations,
          } as LangChangeEvent)),
        ]).pipe(
          takeUntil(this.$cancelBcListeners),
          map(([routeInfo, langEv]) => routeInfo)
        ).subscribe(({ data, fragment, paramMap, queryParamMap, }) => {
          this.refreshBreadcrumbLabel(
            breadcrumb,
            breadcrumbLabel,
            breadcrumbLabelTranslate,
            paramMap, data);
        });
      }
    }

    if (aRoute.firstChild) {
      const parentBreadcrumbs = this.extractBreadcrumbs(aRoute.firstChild);
      breadcrumbs.push(...parentBreadcrumbs);
    }

    return breadcrumbs;
  }

  private refreshBreadcrumbLabel(
    breadcrumb: IBreadcrumb,
    originalLabel: string,
    translate: boolean,
    paramMap: ParamMap,
    data: Data,
  ) {
    const label = StringUtilities.formatFromObject(originalLabel, { params: paramMap, data: data });
    breadcrumb.label = translate
      ? this.translate.instant(label)
      : label;
  }

  private extractBreadcrumbUrl(snapshot: ActivatedRouteSnapshot) {
    const url = snapshot.pathFromRoot
      .map((path) => path.url
        .map((sgmnt) => sgmnt.toString())
        .filter((smnt) => !StringUtilities.isNullOrEmpty(smnt))
        .join(BRADCRUMB_ROUTE_SEPARATOR))
      .filter((smnt) => !StringUtilities.isNullOrEmpty(smnt))
      .join(BRADCRUMB_ROUTE_SEPARATOR);
    const tree = this.router.parseUrl(url);
    return tree.toString();
  }

  /**
   * Extracts the navigation URL (with params) for the `IBreadcrumb` object.
   *
   * @param snapshot The currently activated route's snapshot.
   */
  private extractBreadcrumbUrlConfigured(snapshot: ActivatedRouteSnapshot) {
    return `/${snapshot.pathFromRoot
      .map(path => path.routeConfig?.path)
      .filter(path => path && true)
      .join('/')}`;
  }
}