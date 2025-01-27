import { TestBed } from '@angular/core/testing';

import { EpFullscreenImgService } from './ep-fullscreen-img.service';

describe('EpFullscreenImgService', () => {
  let service: EpFullscreenImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpFullscreenImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
