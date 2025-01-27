import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutes } from 'src/app/shared/guards/auth/auth.guard';
import { RouterModule } from '@angular/router';

const routes: AppRoutes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', loadChildren: () => import('./list/list.module').then(m => m.ListModule) },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class MiniProfilerModule { }
