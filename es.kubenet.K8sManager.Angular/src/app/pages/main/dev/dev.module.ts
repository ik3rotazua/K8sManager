import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutes } from 'src/app/shared/guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: AppRoutes = [
  { path: 'mini-profiler', loadChildren: () => import('./mini-profiler/mini-profiler.module').then(m => m.MiniProfilerModule), },
];

if (!environment.production) {
  routes.push({
    path: 'mockup/styles',
    loadComponent: () => import('./mockup-styles/styles.component').then(c => c.StylesComponent),
  });
}

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class DevModule { }
