import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSave,
  faChevronLeft,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {
  AngularUtilities,
  ArrayTranslatorModule,
  BsFormInputModule,
  BsFormSelectModule,
  DestroySubscriptions,
  SetData,
  keys
} from '@efordevelops/ax-toolbox';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import { EmployeeDto } from 'src/app/shared/api/models';
import { EmployeeService } from 'src/app/shared/api/services';
import { BtnComponent } from 'src/app/shared/components/btn/btn.component';
import {
  IUpdateDataOptions,
  updateRouteData
} from 'src/app/shared/utils/angular.utils';
import {
  RESOLVER_EMPLOYEE_OUT_EMPLOYEE
} from '../resolver/resolver-employee.resolver';
import { FormsModule } from '@angular/forms';
import {
  ServerSideError
} from 'src/app/shared/interceptors/api-error/api-error.interceptor';
import { toCamelCase } from 'src/app/shared/utils/utils';

type This = DetailsComponent;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    TranslateModule,
    FontAwesomeModule,

    ArrayTranslatorModule,

    BsFormInputModule,
    BsFormSelectModule,

    BtnComponent,
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent
  extends DestroySubscriptions
  implements OnInit {
  readonly _faLoading = Object.freeze({ ...faSync });
  readonly _faSave = Object.freeze({ ...faSave });
  readonly _faChevronLeft = Object.freeze({ ...faChevronLeft });

  readonly _routeBack = Object.freeze(['./../']);
  readonly _aRoute: ActivatedRoute;

  _errors: Partial<{ [property in keyof This['item']]: string | string[] }> = {};

  isEditing = false;
  item: EmployeeDto = {} as EmployeeDto;

  private isNew = false;
  constructor(
    private readonly aRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly emplSV: EmployeeService,
  ) {
    super();
    this._aRoute = aRoute;
  }



  ngOnInit(): void {
    this.initListeners();
  }


  onBtnSave(ev: MouseEvent) {
    if (!ev.isTrusted) { return; }

    this._errors = {};
    const obs = this.emplSV.apiEmployeePost$Json({
      body: this.item,
    }).pipe(
      catchError((err) => {
        if (err instanceof ServerSideError) {
          for (const key of keys(err.errorData ?? {}) as string[]) {
            this._errors[toCamelCase(key)] = err.errorData[key];
          }
        }

        return throwError(() => err);
      }),
      tap((newData) => {

        const updateOptions = {
          [RESOLVER_EMPLOYEE_OUT_EMPLOYEE]: { data: newData } as IUpdateDataOptions<EmployeeDto>,
        };

        updateRouteData(this.aRoute, updateOptions);
      }),
    );

    return obs;
  }

  private initListeners() {
    AngularUtilities.activatedRouteChange(this.aRoute)
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(async ({ data, fragment, paramMap, queryParamMap }) => {
        try {
          this.isNew = data.isNew === true;
          if (this.isNew) {
            this.item = {} as EmployeeDto;
          } else {
            this.item = data[RESOLVER_EMPLOYEE_OUT_EMPLOYEE] ?? {};
            if (this.item?.id == null) {
              throw new Error('Item not found.');
            }
          }
        } catch (e) {
          this.goToList();
          throw e;
        }
      });
  }

  private goToList() {
    return this.router.navigate(['/employee/list']);
  }
}
