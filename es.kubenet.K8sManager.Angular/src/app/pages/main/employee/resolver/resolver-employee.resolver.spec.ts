import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { resolverEmployeeResolver } from './resolver-employee.resolver';

describe('resolverEmployeeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => resolverEmployeeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
