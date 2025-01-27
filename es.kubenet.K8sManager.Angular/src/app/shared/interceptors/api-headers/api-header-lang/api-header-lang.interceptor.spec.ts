import { TestBed } from '@angular/core/testing';

import { ApiHeaderLangInterceptor } from './api-header-lang.interceptor';

describe('ApiHeaderLangInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiHeaderLangInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: ApiHeaderLangInterceptor = TestBed.inject(ApiHeaderLangInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
