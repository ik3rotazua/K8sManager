import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FiledropComponent } from './filedrop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [FiledropComponent],
  exports: [FiledropComponent],
  imports: [
    CommonModule,
    ProgressbarModule,

    FontAwesomeModule,
  ]
})
export class FiledropModule { }
