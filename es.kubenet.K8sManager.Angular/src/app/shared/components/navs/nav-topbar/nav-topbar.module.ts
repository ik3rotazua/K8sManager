import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTopbarComponent } from './nav-topbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  BsBreadcrumbModule,
  BsFormAutocompleteModule,
  BsModalConfirmationMessageModule,
  ContextMenuTemplateRefModule
} from '@efordevelops/ax-toolbox';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//import { ImgModule } from '../../img/img.module';



@NgModule({
  declarations: [
    NavTopbarComponent
  ],
  exports: [
    NavTopbarComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ContextMenuTemplateRefModule,
    BsBreadcrumbModule,
    //ImgModule,
  ]
})
export class NavTopbarModule { }
