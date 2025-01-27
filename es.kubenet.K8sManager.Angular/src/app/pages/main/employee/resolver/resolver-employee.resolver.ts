import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StringUtilities } from '@efordevelops/ax-toolbox';
import { of } from 'rxjs';
import { EmployeeDto } from 'src/app/shared/api/models';
import { EmployeeService } from 'src/app/shared/api/services';

export const RESOLVER_EMPLOYEE_IN_ID = 'serviceId';
export const RESOLVER_EMPLOYEE_OUT_EMPLOYEE = 'service';
export type RESOLVER_EMPLOYEE_OUT_EMPLOYEE_TYPE = EmployeeDto;

export const employeeResolver: ResolveFn<RESOLVER_EMPLOYEE_OUT_EMPLOYEE_TYPE> = (route, state) => {
  const id = route.paramMap.get(RESOLVER_EMPLOYEE_IN_ID);
  if (!StringUtilities.isNullOrWhitespace(id)) {
    const sv = inject(EmployeeService);
    return sv.apiEmployeeIdGet$Json({ id });
  }

  return of(null);
};
