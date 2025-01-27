import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpFullscreenImgDirective } from './ep-fullscreen-img.directive';



@NgModule({
  declarations: [EpFullscreenImgDirective],
  exports: [EpFullscreenImgDirective],
  imports: [
    CommonModule
  ]
})
export class EpFullscreenImgDirectiveModule { }
