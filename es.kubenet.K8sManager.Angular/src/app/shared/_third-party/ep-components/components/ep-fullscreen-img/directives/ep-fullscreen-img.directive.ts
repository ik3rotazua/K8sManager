import {
  Directive,
  HostListener,
  Input,
  ElementRef
} from '@angular/core';
import { EpFullscreenImgService } from '../services/ep-fullscreen-img.service';

@Directive({
  selector: '[appFullscreenImg]'
})
export class EpFullscreenImgDirective {
  /** URL of the fullscreen IMG */
  @Input() epFullscreenImg: string;

  @HostListener('click', ['$event']) onHostClick(event) {
    this.openFullscreen(event);
    setTimeout(() => {
      this.el.nativeElement.blur();
    }, 0);
  }

  constructor(
    public service: EpFullscreenImgService,
    public el: ElementRef<HTMLImageElement>
  ) { }


  private openFullscreen(ev: MouseEvent) {
    if (!ev.isTrusted) { return; }

    let imgUrl = this.epFullscreenImg;
    if (!imgUrl && this.el.nativeElement.tagName === 'img') { imgUrl = this.el.nativeElement.src; }
    if (!imgUrl) { throw new Error('Element image url not valid'); }

    this.service.openImage(imgUrl);
  }
}
