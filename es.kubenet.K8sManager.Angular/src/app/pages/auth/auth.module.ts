import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent, loadChildren: () => import('./login/login.module').then(m => m.LoginModule), },
  { path: 'logout', component: AuthComponent, loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule), },
];

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AuthModule { }
