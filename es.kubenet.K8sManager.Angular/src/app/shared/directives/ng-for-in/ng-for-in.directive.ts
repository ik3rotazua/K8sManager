import {
  Directive,
  OnChanges,
  Input,
  SimpleChanges,
  SimpleChange,
  DoCheck
} from '@angular/core';
import { NgForOf } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngFor][ngForIn]'
})
export class NgForInDirective<T = any> extends NgForOf<T> {
  @Input() set ngForIn(obj: T) {
    if (obj == null) obj = <any>{};
    
    const asArray = Object.keys(obj)
      .map(k => obj[k]);
    this.ngForOf = asArray;
  }
}
