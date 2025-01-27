import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: PrivacyComponent }
];

@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ]
})
export class PrivacyModule { }
