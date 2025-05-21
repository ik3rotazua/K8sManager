import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent) },
];

export const ROUTES_DASHBOARD = routes;