import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canMatch } from './shared/guards/translate/translate.guard';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canMatch: [canMatch],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

@NgModule({
  imports: [],
})
export class AppRoutingFirstRouteModule { }
