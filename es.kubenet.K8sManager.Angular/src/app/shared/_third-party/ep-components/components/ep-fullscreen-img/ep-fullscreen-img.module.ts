import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpFullscreenImgComponent } from './ep-fullscreen-img.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HammerModule } from '@angular/platform-browser';
import { AutoBlurModule } from '@efordevelops/ax-toolbox';

@NgModule({
  declarations: [EpFullscreenImgComponent],
  exports: [EpFullscreenImgComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AutoBlurModule,
    HammerModule,
  ]
})
export class EpFullscreenImgModule {
}
