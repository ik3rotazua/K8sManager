import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  /** Authentication layout */
  {
    path: '', redirectTo: 'auth', pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.ROUTES_AUTH),
    canLoad: [], canActivate: [],
  },
  {
    path: '', component: MainComponent,
    loadChildren: () => import('./main/main.routes').then(m => m.ROUTES_MAIN),
  },
];

export const ROUTES_PAGES = routes;