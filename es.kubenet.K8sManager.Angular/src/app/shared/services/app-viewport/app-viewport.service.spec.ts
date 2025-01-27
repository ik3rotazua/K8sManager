import { TestBed } from '@angular/core/testing';

import { AppViewportService } from './app-viewport.service';

describe('AppViewportService', () => {
  let service: AppViewportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppViewportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
