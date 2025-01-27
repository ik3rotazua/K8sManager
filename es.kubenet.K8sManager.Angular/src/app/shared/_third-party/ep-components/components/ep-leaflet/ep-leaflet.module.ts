import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpLeafletComponent } from './ep-leaflet.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [EpLeafletComponent],
  exports: [EpLeafletComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ]
})
export class EpLeafletModule { }
