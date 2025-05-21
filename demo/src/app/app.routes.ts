import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./pages/pages.routes').then(m => m.ROUTES_PAGES),
  },
  { path: '**', redirectTo: '/' },
];

export const APP_ROUTES = routes;