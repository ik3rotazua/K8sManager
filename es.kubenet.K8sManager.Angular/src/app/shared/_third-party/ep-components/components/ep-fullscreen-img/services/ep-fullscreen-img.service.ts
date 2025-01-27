import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EpFullscreenImgService {
  _animationTime = 300;

  _imgUrl = null;
  _show = new EventEmitter<void>();
  _hide = new EventEmitter<void>();
  constructor(
  ) { }

  openImage(url: string) {
    this._imgUrl = url;
    this._show.next();
  }
  closeImage() {
    this._hide.next();
    setTimeout(() => {
      this._imgUrl = null;
    }, this._animationTime);
  }
}
