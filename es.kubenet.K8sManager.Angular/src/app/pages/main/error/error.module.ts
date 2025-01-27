import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '404', pathMatch: 'full' },
  { path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
];

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ErrorModule { }
