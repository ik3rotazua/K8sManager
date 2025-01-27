import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './legal.component';

const routes: Routes = [
  { path: 'cookies', loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesModule), },
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule), },
  { path: 'tos', loadChildren: () => import('./tos/tos.module').then(m => m.TosModule), },
];

@NgModule({
  declarations: [LegalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class LegalModule { }
