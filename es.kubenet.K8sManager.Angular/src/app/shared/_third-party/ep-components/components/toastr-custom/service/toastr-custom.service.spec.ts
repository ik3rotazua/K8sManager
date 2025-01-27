import { TestBed } from '@angular/core/testing';

import { ToastrCustomService } from './toastr-custom.service';

describe('ToastrCustomService', () => {
  let service: ToastrCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
