import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import * as Hammer from 'hammerjs';

import { EpFullscreenImgService } from './services/ep-fullscreen-img.service';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ep-fullscreen-img',
  templateUrl: './ep-fullscreen-img.component.html',
  styleUrls: ['./ep-fullscreen-img.component.scss']
})
export class EpFullscreenImgComponent
  extends DestroySubscriptions
  implements OnInit, OnDestroy {
  @ViewChild('img', { static: false }) set img(el: ElementRef<HTMLImageElement>) {
    if ((this._img == null && (el == null ||
      el.nativeElement == null)) ||
      this._img === (el != null && el.nativeElement)) { return; }

    if (el == null || el.nativeElement == null) {
      this._img = null;
      this.destroyHammerJS();
    } else {
      this._img = el.nativeElement;
      this.initHammerJS();
    }
  }

  _iconClose = faTimes;

  constructor(
    public cdref: ChangeDetectorRef,
    public service: EpFullscreenImgService,
    public el: ElementRef<HTMLElement>
  ) {
    super();
    this.initListeners();
  }
  private _img: HTMLImageElement;

  _isShown = false;

  @Input() btnCloseLabel = '';


  private bodyScrollState = null;
  private hammer: HammerManager;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    this.hide();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.hammer.destroy();
  }

  initListeners() {
    this.service._show
      .pipe(
        takeUntil(this.$onDestroyed)
      )
      .subscribe(() => {
        if (this._isShown) { return; }
        this._isShown = true;

        const body = document.getElementsByTagName('body').item(0);
        const bodyStyles = window.getComputedStyle(body);
        this.bodyScrollState = body.style.overflow;

        body.style.overflow = 'hidden';

        // this.cdref.detectChanges();
      });

    this.service._hide
      .pipe(
        takeUntil(this.$onDestroyed)
      )
      .subscribe(() => {
        if (!this._isShown) { return; }
        this._isShown = false;

        const body = document.getElementsByTagName('body').item(0);
        body.style.overflow = this.bodyScrollState;
      });
  }

  hide() {
    if (!this._isShown) { return; }
    this.service.closeImage();
  }

  private destroyHammerJS() {
    this.hammer.destroy();
  }
  private initHammerJS() {
    const container = this.el.nativeElement.firstElementChild as HTMLElement;
    let posX = 0,
      posY = 0,
      scale = 1,
      last_scale = 1,
      last_posX = 0,
      last_posY = 0,
      max_pos_x = 0,
      max_pos_y = 0,
      transform = '';

    const el = this._img.parentElement;

    this.hammer = new Hammer.Manager(container);
    // this.hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    this.hammer.add(new Hammer.Tap({}));
    this.hammer.add(new Hammer.Pan({}));
    this.hammer.add(new Hammer.Pinch({}));

    // doubletap is available aswell
    this.hammer.on('tap pan panstart panend pinch pinchend', (ev) => {
      // switch-case no nos vale en este caso, dado que hay ifs que deben ejecutarse
      // después del escalado
      if (ev.type === 'tap') {
        transform =
          'translate3d(0, 0, 0) ' +
          'scale3d(2, 2, 1) ';
        scale = 2;
        last_scale = 2;
        container.classList.add('scaled');
        try {
          const compStyle = window.getComputedStyle(el, null);
          const transformCurrent = (compStyle.getPropertyValue('transform') ?? compStyle.getPropertyValue('-webkit-transform'))
            .toString();

          if (transformCurrent !== 'matrix(1, 0, 0, 1, 0, 0)') {
            transform =
              'translate3d(0, 0, 0) ' +
              'scale3d(1, 1, 1) ';
            scale = 1;
            last_scale = 1;
            container.classList.remove('scaled');
          }
        } catch (err) { }
        el.style.transform = transform;
        transform = '';
      }

      // pan
      if (scale !== 1) {
        posX = last_posX + ev.deltaX;
        posY = last_posY + ev.deltaY;
        max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
        max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
        if (posX > max_pos_x) {
          posX = max_pos_x;
        }
        if (posX < -max_pos_x) {
          posX = -max_pos_x;
        }
        if (posY > max_pos_y) {
          posY = max_pos_y;
        }
        if (posY < -max_pos_y) {
          posY = -max_pos_y;
        }
      }


      // pinch
      if (ev.type === 'pinch') {
        scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
      }
      if (ev.type === 'pinchend') {
        last_scale = scale;
      }

      // panstart - panend
      if (ev.type === 'panstart') {
        container.classList.add('panning');
      } else if (ev.type === 'panend') {
        last_posX = posX < max_pos_x ? posX : max_pos_x;
        last_posY = posY < max_pos_y ? posY : max_pos_y;
        container.classList.remove('panning');
      }

      if (scale !== 1) {
        transform =
          `translate3d(${posX}px,${posY}px, 0) ` +
          `scale3d(${scale}, ${scale}, 1)`;
      }

      if (transform) {
        el.style.transform = transform;
      }
    });
  }

  private setImgScale(scale: number) {
    const img = this.getImg();
    img.style.transform = `scale(${scale})`;
  }
  private getImg() {
    return this.el.nativeElement.querySelector('img');
  }
}
