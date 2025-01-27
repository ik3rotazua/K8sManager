import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollDebounce = new Subject<{
    el: HTMLElement;
    opts: Partial<ScrollIntoViewOptionsExtended>;
  }>();
  private scrollByContainer = new Subject<{
    el: HTMLElement;
    container: HTMLElement | Window;
    offsetX: number;
    offsetY: number;
  }>();

  constructor() {
    this.init();
  }

  scrollTo(el: HTMLElement, behavior: ScrollIntoViewOptionsExtended['behavior'] = 'smooth') {
    const opts: Partial<ScrollIntoViewOptionsExtended> = {
      behavior,
      block: 'start',
      inline: 'nearest',
    };
    this.scrollDebounce.next({ el, opts });
  }
  /**
   * @param target The element that is wanted to visualize.
   * @param parent The parent containing the target's scrollbar
   */
  scrollToByContainer(
    target: HTMLElement,
    offsetX?: number,
    offsetY?: number,
    container?: HTMLElement | Window,
    instant = false
  ) {
    if (container == null) {
      container = window;
    }
    if (offsetX == null) {
      offsetX = 0;
    }
    if (offsetY == null) {
      offsetY = 0;
    }

    const scrollData = {
      container: container,
      el: target,
      offsetX: offsetX,
      offsetY: offsetY,
    };

    if (instant === true) {
      this.scrollToContainer(scrollData);
    } else {
      this.scrollByContainer.next(scrollData);
    }
  }

  private getElementPositionRelativeToParent(
    target: HTMLElement,
    container: HTMLElement | Window
  ) {
    const targetBounds = target.getBoundingClientRect();

    const result: ITopLeftCoords = {
      x: targetBounds.left,
      y: targetBounds.top,
    };

    if (container instanceof Window) {
      result.x = targetBounds.left + window.scrollX;
      result.y = targetBounds.top + window.scrollY;
    }
    if (!(container instanceof Window)) {
      const containerBounds = container.getBoundingClientRect();
      result.x = targetBounds.left - containerBounds.left;
      result.y = targetBounds.top - containerBounds.top;
    }

    return result;
  }

  private init() {
    this.scrollDebounce
      .pipe(debounceTime(100))
      .pipe(filter((data) => data.el != null))
      .subscribe((data) => {
        data.el.scrollIntoView(data.opts);
      });
    this.scrollByContainer
      .pipe(debounceTime(100))
      .pipe(filter((data) => data != null))
      .subscribe((data) => {
        this.scrollToContainer(data);
      });
  }
  private scrollToContainer(data: {
    el: HTMLElement;
    container: HTMLElement | Window;
    offsetX: number;
    offsetY: number;
  }) {
    const bounds = this.getElementPositionRelativeToParent(
      data.el,
      data.container
    );
    const options: ScrollToOptions = {
      left: bounds.x + data.offsetX,
      top: bounds.y + data.offsetY,
      behavior: 'smooth',
    };

    try {
      parent.scrollTo(options);
    } catch (e) {
      parent.scrollTo(options.left, options.top);
    }
  }
}
export class ScrollIntoViewOptionsExtended
implements ScrollIntoViewOptions, ScrollOptions {
  behavior: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}
export interface ITopLeftCoords {
  x: number;
  y: number;
}
// export interface IScrollable {
//   scrollTo(options?: ScrollToOptions): void;
//   scrollTo(x: number, y: number): void;
// }
