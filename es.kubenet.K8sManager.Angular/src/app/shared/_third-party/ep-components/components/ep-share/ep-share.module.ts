import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpShareComponent } from './ep-share.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [EpShareComponent],
  exports: [EpShareComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ]
})
export class EpShareModule { }
