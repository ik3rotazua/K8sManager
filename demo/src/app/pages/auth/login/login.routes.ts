import { Routes } from '@angular/router';

export const ROUTES_AUTH_LOGIN: Routes = [
  { path: '', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
];