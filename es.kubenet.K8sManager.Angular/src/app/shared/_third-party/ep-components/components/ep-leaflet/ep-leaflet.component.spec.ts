import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from '@angular/core/testing';

import { EpLeafletComponent } from './ep-leaflet.component';

describe('EpLeafletComponent', () => {
  let component: EpLeafletComponent;
  let fixture: ComponentFixture<EpLeafletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EpLeafletComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
