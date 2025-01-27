import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from '@angular/core/testing';

import { EpShareComponent } from './ep-share.component';

describe('EpShareComponent', () => {
  let component: EpShareComponent;
  let fixture: ComponentFixture<EpShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EpShareComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
