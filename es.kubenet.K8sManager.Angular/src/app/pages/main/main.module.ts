import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import {
  AxRoutes,
  BsBreadcrumbModule,
  BsDatatableModule,
  BsMenuModule,
  BsModalConfirmationMessageModule
} from '@efordevelops/ax-toolbox';

import { MainComponent } from './main.component';
import {
  AppRoutes,
  PolicyJoinMode,
  canActivate,
  canActivateChild,
  canMatch,
} from 'src/app/shared/guards/auth/auth.guard';

import { ImgModule } from 'src/app/shared/components/img/img.module';
import { faHome, faPlug } from '@fortawesome/free-solid-svg-icons';
import {
  NavSidebarModule
} from 'src/app/shared/components/navs/nav-sidebar/nav-sidebar.module';
import {
  NavTopbarModule
} from 'src/app/shared/components/navs/nav-topbar/nav-topbar.module';
import { PolicyMenu } from 'src/app/shared/api/models';

const routes: AppRoutes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule), },

      {
        path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
        data: {
          breadcrumb: {
            label: 'MENU.PAGE.EMPLOYEE.MAIN',
            translate: true,
            icon: faPlug,
          }
        }
      },
      {
        path: 'mini-profiler', loadChildren: () => import('./dev/mini-profiler/mini-profiler.module').then(m => m.MiniProfilerModule),
        data: {
          policy: [PolicyMenu.PolicyMenuAdministration]
        },
        canActivate: [canActivate],
        canActivateChild: [canActivateChild],
      },

      {
        path: 'dev', loadChildren: () => import('./dev/dev.module').then(m => m.DevModule),
        canMatch: [canMatch],
        data: {
          policy: [PolicyMenu.PolicyMenuAdministration],
          policyJoinMode: PolicyJoinMode.And,
        }
      },
    ],
    data: {
      breadcrumb: {
        label: 'Home',
        icon: faHome
      },
    },
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    FontAwesomeModule,
    BsDropdownModule,
    BsMenuModule,
    BsDatatableModule,
    BsModalConfirmationMessageModule,
    NavSidebarModule,
    NavTopbarModule,
    BsBreadcrumbModule,
    ImgModule,
  ]
})
export class MainModule { }
