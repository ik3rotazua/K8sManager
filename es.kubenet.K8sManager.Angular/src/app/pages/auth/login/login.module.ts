import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ArrayTranslatorModule,
  BsFormCheckboxModule,
  BsFormInputModule
} from '@efordevelops/ax-toolbox';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  AuthFormComponent
} from 'src/app/shared/components/forms/auth-form/auth-form.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: ':errMsg', component: LoginComponent },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ArrayTranslatorModule,
    RouterModule.forChild(routes),
    TranslateModule,
    BsDropdownModule,

    BsFormCheckboxModule,
    BsFormInputModule,

    AuthFormComponent,
  ]
})
export class LoginModule { }
