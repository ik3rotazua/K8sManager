import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  AutoBlurModule,
  BsDatatableModule,
  BsModalConfirmationMessageModule,
} from '@efordevelops/ax-toolbox';
import { ListComponent } from './list.component';
import { AppRoutes } from 'src/app/shared/guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  BtnCopyTextModule,
} from 'src/app/shared/components/btn-copy-text/btn-copy-text.module';

const routes: AppRoutes = [
  { path: '', component: ListComponent, },
];


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    BsDatatableModule,
    BsModalConfirmationMessageModule,
    BsDatepickerModule,
    BtnCopyTextModule,
    FontAwesomeModule,
    AutoBlurModule,
  ],
  providers: [
    DecimalPipe,
  ]
})
export class ListModule { }
