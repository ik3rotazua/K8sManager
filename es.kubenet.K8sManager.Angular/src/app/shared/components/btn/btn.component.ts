import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { BsThemeColors, BsThemeSize } from '../../models/bootstrap/bs.models';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import {
  BehaviorSubject,
  Observable,
  finalize,
  from,
  isObservable,
  of,
  takeUntil,
} from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterModule,
  ],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss'
})
export class BtnComponent
  extends DestroySubscriptions
  implements OnDestroy {
  _isLoading = false;

  @Input() type: HTMLButtonElement['type'] = 'button';
  @Input() label?: string;
  @Input() disabled = false;

  @Input() icon?: IconProp;
  @Input() iconSpin = false;

  @Input() iconIsLoading?: IconProp = faSync;
  @Input() iconIsLoadingSpin = true;

  @Input() size: BsThemeSize = 'sm';
  @Input() color: BsThemeColors = 'primary';

  @Input() route: RouterLink;

  @Input() clickFn?: (ev: Event) => Promise<void> | Observable<void> | void;

  @Output() btnClick = new EventEmitter<Event>;
  @Output() isLoading = new BehaviorSubject<boolean>(this._isLoading);

  constructor() {
    super();
    this.btnClick.pipe(
      takeUntil(this.$onDestroyed),
    ).subscribe((ev) => {
      if (this.disabled) { return; }
      if (this._isLoading) { return; }

      if (this.clickFn) {
        const r = this.clickFn(ev);
        const obs = r instanceof Promise
          ? from(r)
          : isObservable(r)
            ? r
            : of(r);

        this._isLoading = true;
        this.isLoading.next(this._isLoading);
        obs.pipe(
          finalize(() => {
            this._isLoading = false;
            this.isLoading.next(this._isLoading);
          })
        ).subscribe(() => { });
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.btnClick.complete();
    this.isLoading.complete();
  }
}
