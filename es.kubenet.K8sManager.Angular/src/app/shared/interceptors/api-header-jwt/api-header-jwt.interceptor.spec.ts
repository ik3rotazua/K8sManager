import { TestBed } from '@angular/core/testing';

import { ApiHeaderJwtInterceptor } from './api-header-jwt.interceptor';

describe('ApiHeaderJwtInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiHeaderJwtInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: ApiHeaderJwtInterceptor = TestBed.inject(ApiHeaderJwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
