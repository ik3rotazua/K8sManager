import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent
  extends DestroySubscriptions
  implements OnInit {
  @ViewChild('preloader', { static: true }) _preloader: ElementRef<HTMLDivElement>;

  /** Current status, used to control de DOM component visibility */
  _isLoaded = false;

  @Input() set isLoaded(value: boolean) {
    this._isLoadingChange.next(value);
  }
  /**
   * If false, a full-screen loader will be displayed.
   * 
   * Use true if you need the loader to fill it's parent container, but the parent's position **needs to be relative**
   */
  @Input() isAbsolute = true;

  private _isLoadingChange = new BehaviorSubject(false);
  constructor(
    private readonly el: ElementRef<HTMLElement>,
  ) {
    super();
    this.initListeners();
  }

  ngOnInit(): void {
  }


  private realculateBounds() {
    if (this.isAbsolute) {
      if (this._isLoaded) {
        this._preloader.nativeElement.style.height = null;
        this._preloader.nativeElement.style.width = null;
      } else {
        const container = this.el.nativeElement
          .parentElement;
        const containerStyles = window.getComputedStyle(container);
        this._preloader.nativeElement.style.height = containerStyles.height;
        this._preloader.nativeElement.style.width = containerStyles.width;
      }
    }
  }

  private initListeners() {
    this._isLoadingChange
      .pipe(filter(v => v !== this._isLoaded))
      .subscribe((isLoaded) => {
        this._isLoaded = isLoaded;
        this.realculateBounds();
      });
  }
}
