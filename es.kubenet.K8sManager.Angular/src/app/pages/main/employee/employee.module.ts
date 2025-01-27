import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/shared/guards/auth/auth.guard';
import {
  RESOLVER_EMPLOYEE_IN_ID,
  RESOLVER_EMPLOYEE_OUT_EMPLOYEE,
  RESOLVER_EMPLOYEE_OUT_EMPLOYEE_TYPE,
  employeeResolver
} from './resolver/resolver-employee.resolver';
import { nameof } from '@efordevelops/ax-toolbox';

const routes: AppRoutes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', loadComponent: () => import('./list/list.component').then((m) => m.ListComponent), },
  {
    path: 'new', loadComponent: () => import('./details/details.component').then((m) => m.DetailsComponent),
    data: {
      isNew: true,
    }
  },
  {
    path: `:${RESOLVER_EMPLOYEE_IN_ID}`, loadComponent: () => import('./details/details.component').then((m) => m.DetailsComponent),
    resolve: {
      [RESOLVER_EMPLOYEE_OUT_EMPLOYEE]: employeeResolver,
    },
    data: {
      breadcrumb: {
        label: [
          `{data.${RESOLVER_EMPLOYEE_OUT_EMPLOYEE}.${nameof<RESOLVER_EMPLOYEE_OUT_EMPLOYEE_TYPE>('name')}}`,
          `{data.${RESOLVER_EMPLOYEE_OUT_EMPLOYEE}.${nameof<RESOLVER_EMPLOYEE_OUT_EMPLOYEE_TYPE>('surname1')}}`,
        ].join(' ')
      }
    }
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class EmployeeModule { }
