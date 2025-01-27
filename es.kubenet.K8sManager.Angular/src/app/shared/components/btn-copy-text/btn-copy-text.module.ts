import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCopyTextComponent } from './btn-copy-text.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoBlurModule } from '@efordevelops/ax-toolbox';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    BtnCopyTextComponent
  ],
  exports: [
    BtnCopyTextComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AutoBlurModule,
    TooltipModule,
  ]
})
export class BtnCopyTextModule { }
