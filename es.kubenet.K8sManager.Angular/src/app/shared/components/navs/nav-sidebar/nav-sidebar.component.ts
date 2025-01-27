import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  DestroySubscriptions,
  ILayoutMenuItem,
  AngularUtilities
} from '@efordevelops/ax-toolbox';
import { BehaviorSubject, timer } from 'rxjs';
import {
  debounce,
  distinctUntilChanged,
  filter,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import {
  AppViewportService,
  BsBreakpoint
} from 'src/app/shared/services/app-viewport/app-viewport.service';
import {
  ANG_ANIMATION_COLLAPSE_HEIGHT,
  ANG_ANIMATION_COLLAPSE_WIDTH
} from 'src/app/shared/utils/angular-animations/collapse.animation';

type This = NavSidebarComponent;
const MENU_MINI_DISALLOWED_BREAKPOINTS: BsBreakpoint[] = ['xs', 'sm'];
/**
 * Valor, en milisegundos, de timeout que se aplica al evento de pasar el ratón por encima
 * del menú. Se utiliza para determinar cuánto hay que esperar antes de animar el despliegue
 * lateral del menú. Útil para evitar que el usuario abra el menú por accidente.
 *
 * Usar un valor negativo deshabilitará el evento.
 */
const EV_TIMEOUT_MOUSE_HOVER_IN_MS = 300;
/**
 * Valor, en milisegundos, de timeout que se aplica al evento de separar el ratón por encima
 * de cualquier elemento que no sea el menú. Se utiliza para determinar cuánto hay que esperar
 * antes de animar el encogimiento lateral del menú. Útil para evitar que el usuario cierre
 * el menú por accidente.
 *
 * Usar un valor negativo deshabilitará el evento.
 */
const EV_TIMEOUT_MOUSE_HOVER_OUT_MS = 0;

@Component({
  selector: 'app-nav-sidebar',
  templateUrl: './nav-sidebar.component.html',
  styleUrls: ['./nav-sidebar.component.scss'],
  animations: [
    ANG_ANIMATION_COLLAPSE_HEIGHT,
    ANG_ANIMATION_COLLAPSE_WIDTH,
  ]
})
export class NavSidebarComponent
  extends DestroySubscriptions
  implements OnInit {
  @HostBinding('class') class = 'navbar navbar-vertical fixed-start navbar-expand-md navbar-light';
  @HostBinding('class.navbar-vertical-sm') isMini = true;
  @HostListener('mouseenter', []) onMouseover = () => this._$evMouseHover.next(true);
  @HostListener('mouseleave', []) onMouseout = () => this._$evMouseHover.next(false);

  @Input() menuItems: ILayoutMenuItem[] = [];
  @Input() set closeOnNavigation(value: boolean) {
    this._$inpCloseOnNavChange.next(value);
  }

  _isOpen = false;
  _isMouseover = false;

  /**
   * Evento disparado cuando se activan `onMouseover` y `onMouseout`
   */
  private readonly _$evMouseHover = new EventEmitter<boolean>();
  private readonly _$inpCloseOnNavChange = new BehaviorSubject<boolean>(true);
  private isMiniAllowed = true;

  el: HTMLElement;
  constructor(
    elRef: ElementRef,
    private readonly router: Router,
    private readonly appVpSV: AppViewportService,
  ) {
    super();
    this.el = elRef.nativeElement;
    this.initListeners();
  }

  ngOnInit(): void {
    this.recalculateIsMini();
  }

  toggle() {
    this._isOpen = !this._isOpen;
    this.recalculateIsMini();
  }

  onMenuItemClick(ev: Event, item: This['menuItems'][0]) {
    if (!this._isOpen) {
      this._isOpen = true;
      this.recalculateIsMini();
    }

    const hasChildren = (item.children ?? []).length > 0;
    if (!hasChildren) { return; }

    if (item.onClick) {
      item.onClick(ev);
    }
    item.isOpen = !(item.isOpen ?? false);
  }

  private recalculateIsMini() {
    this.isMini = this.isMiniAllowed && !this._isMouseover && !this._isOpen;
  }

  private initListeners() {
    this.router.events.pipe(
      takeUntil(this.$onDestroyed),
      filter(ev => ev instanceof NavigationEnd),
      withLatestFrom(this._$inpCloseOnNavChange, (ev, isOn) => ({ ev, isOn })),
      filter(data => data.isOn),
    ).subscribe(() => {
      this._isOpen = false;
      this._isMouseover = false;
      this.recalculateIsMini();
    });

    this.appVpSV.$breakpointChange.pipe(
      takeUntil(this.$onDestroyed),
    ).subscribe((size) => {
      this.isMiniAllowed = !MENU_MINI_DISALLOWED_BREAKPOINTS.includes(size);
      this.recalculateIsMini();
    });

    this._$evMouseHover.pipe(
      takeUntil(this.$onDestroyed),
      filter((isHovered) => isHovered
        ? (EV_TIMEOUT_MOUSE_HOVER_IN_MS >= 0)
        : (EV_TIMEOUT_MOUSE_HOVER_OUT_MS >= 0)),
      debounce(isHovered => timer(isHovered
        ? EV_TIMEOUT_MOUSE_HOVER_IN_MS
        : EV_TIMEOUT_MOUSE_HOVER_OUT_MS)),
      distinctUntilChanged(),
    ).subscribe((isHovered) => {
      this._isMouseover = isHovered;
      this.recalculateIsMini();
    });
  }
}
