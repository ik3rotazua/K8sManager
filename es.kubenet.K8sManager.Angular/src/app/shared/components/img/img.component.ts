import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit
} from '@angular/core';
import { DestroySubscriptions, nameof } from '@efordevelops/ax-toolbox';
import { Observable, firstValueFrom } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent
  extends DestroySubscriptions
  implements OnInit {

  @Input() class?: NgClass['ngClass'];
  @Input() alt?: string;
  @Input() set src(value: string | null) { this._$src.next(value); }
  @Input() errorSrc = '/assets/img/logo/logo.svg';

  _currentSrc = this.errorSrc;

  private _$src = new EventEmitter<string | null>();
  private lastReqId = uuid();
  constructor(
  ) {
    super();
    this.initListeners();
  }

  ngOnInit(): void {
  }

  private initListeners() {
    this._$src
      .pipe(
        takeUntil(this.$onDestroyed),
      )
      .subscribe(async (src) => {
        const reqId = uuid();
        this.lastReqId = reqId;
        const apiCall = await this.loadImage(src ?? this.errorSrc).pipe(takeUntil(this.$onDestroyed));

        const imgSrc = await firstValueFrom(apiCall);
        if (this.lastReqId === reqId) {
          this._currentSrc = imgSrc;
        }
      });
  }

  private loadImage(src: string) {
    const obs = new Observable<string>((sub) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        sub.next(img.src);
        sub.complete();
      };
      img.onerror = () => {
        console.error(`Could not load image src [${src}]`);
        sub.next(this.errorSrc);
        sub.complete();
      };
    });

    return obs;
  }
}
