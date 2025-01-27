import { EventEmitter, Injectable } from '@angular/core';
import { 
  DestroySubscriptions, 
  StringUtilities 
} from '@efordevelops/ax-toolbox';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  map,
  startWith,
  takeUntil
} from 'rxjs/operators';

export type BsBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
const BS_SCSS_PREFIX = 'bs-';
const BS_CSS_VARNAME = `--${BS_SCSS_PREFIX}vp-helper`;
const DEBOUNCE_MS = 100;

@Injectable({
  providedIn: 'root'
})
export class AppViewportService
  extends DestroySubscriptions {

  private isInitialized = false;
  private currentBreakpoint = this.getCurrentBreakpoint();
  private _$breakpointChange = new EventEmitter<BsBreakpoint>();
  $breakpointChange = this._$breakpointChange
    .pipe(
      takeUntil(this.$onDestroyed),
      startWith(this.currentBreakpoint)
    );

  constructor() {
    super();
  }

  init() {
    if (this.isInitialized) {
      throw new Error('Already initialized');
    }
    this.initListeners();
  }

  private initListeners() {
    this.initListenerResize();
  }

  private initListenerResize() {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.$onDestroyed),
        debounceTime(DEBOUNCE_MS),
        map(() => window.innerWidth),
      ).subscribe((widthPx) => {
        
        const breakpoint = this.getCurrentBreakpoint();
        this._$breakpointChange.next(breakpoint);
      });
  }

  private getCurrentBreakpoint() {
    const el = document.createElement('div');
    el.classList.add('vp-helper');
    document.body.appendChild(el);
    const bpCssValue = getComputedStyle(el).getPropertyValue(BS_CSS_VARNAME);
    if (StringUtilities.isNullOrWhitespace(bpCssValue)) {
      throw new Error(`Could not determine the value of .vp-helper --> ${BS_CSS_VARNAME}. Is your CSS correctly setup?`);
    };
    el.parentElement.removeChild(el);
    return bpCssValue as BsBreakpoint;
  }

}

