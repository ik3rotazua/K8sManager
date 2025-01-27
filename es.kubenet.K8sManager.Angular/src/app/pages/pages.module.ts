import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import {
  AppRoutes,
  canActivate,
  canMatch
} from '../shared/guards/auth/auth.guard';

const routes: AppRoutes = [
  /** Authentication layout */
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canLoad: [], canActivate: [],
  },
  /** Main layout */
  {
    path: '', component: MainComponent,
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canMatch: [canMatch],
    canActivate: [canActivate],
    data: { }
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class PagesModule { }
