import { Routes } from '@angular/router';

export const ROUTES_AUTH: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.routes').then(m => m.ROUTES_AUTH_LOGIN), },
];