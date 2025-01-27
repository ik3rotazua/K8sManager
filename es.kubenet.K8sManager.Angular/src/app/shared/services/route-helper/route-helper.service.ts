import { Injectable } from '@angular/core';
import {
  NavigationEnd,
  ResolveEnd,
  Router
} from '@angular/router';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type This = RouteHelperService;
export const STORAGE_KEY_404_LASTORIGIN = '404-last-origin';

@Injectable({
  providedIn: 'root'
})
export class RouteHelperService
  extends DestroySubscriptions {
  private url404?: string;
  private isInitialized = false;

  private _$originOf404 = new BehaviorSubject<string | null>(null);

  $originOf404 = this._$originOf404
    .pipe(takeUntil(this.$onDestroyed));

  constructor(
    private readonly router: Router,
    private readonly storage: LocalStorageService,
  ) {
    super();
  }

  async init() {
    if (this.isInitialized) {
      throw new Error('Already initialized');
    }

    this.isInitialized = true;
    this.initProperties();
    this.initRouterListeners();
  }

  private initRouterListeners() {
    this.router.events
      // .pipe(takeUntil(this.$onDestroyed))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.onNavigationEnd(event);
        }
        else if (event instanceof ResolveEnd) {
          this.onResolveEnd(event);
        }
      });
  }

  private initProperties() {
    this.initProperties404();
  }

  private initProperties404() {
    const urlTree404 = this.router.createUrlTree(['/error/404']);
    this.url404 = urlTree404.toString();

    try {
      const lastOrigin = (this.storage.getValue<string | null>(STORAGE_KEY_404_LASTORIGIN) ?? null);
      this._$originOf404.next(lastOrigin);
    } catch {
      this._$originOf404.next(null);
    }
  }

  private onNavigationEnd(ev: NavigationEnd) {
    this.onNavEnd404(ev);
  }

  private onNavEnd404(ev: NavigationEnd) {
    // Si la funcionalidad no está habilitada, se ignora el método.
    if (!this.url404) { return; }
    // Si la URL ya es la de 404, ignorar el método.
    if ((ev.url ?? '').startsWith(this.url404)) { return; }
    // Si la URL es correcta y no ha sido redirigido a un 404, ajustamos
    // los datos de información y detenemos la ejecución.
    const origin = (ev.urlAfterRedirects).startsWith(this.url404)
      ? ev.url
      : null;

    this._$originOf404.next(origin);
    try {
      this.storage.setValue(STORAGE_KEY_404_LASTORIGIN, origin);
    } catch { } // No es necesario informar de un error

  }

  private onResolveEnd(ev: ResolveEnd) {
    this.onNavResolve404(ev);
  }

  private onNavResolve404(ev: ResolveEnd) {
    try {
      const lastOrigin = (this.storage.getValue<string | null>(STORAGE_KEY_404_LASTORIGIN) ?? null);
      this._$originOf404.next(lastOrigin);
    } catch {
      this._$originOf404.next(null);
    }
  }
}
