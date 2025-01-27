import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForInDirective } from './ng-for-in.directive';



@NgModule({
  declarations: [NgForInDirective],
  exports: [NgForInDirective],
  imports: [
    CommonModule,
  ]
})
export class NgForInModule { }
