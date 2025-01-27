import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSidebarComponent } from './nav-sidebar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    NavSidebarComponent
  ],
  exports: [
    NavSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
  ]
})
export class NavSidebarModule { }
