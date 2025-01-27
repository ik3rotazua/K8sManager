import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from '@angular/core/testing';

import { FiledropComponent } from './filedrop.component';

describe('FiledropComponent', () => {
  let component: FiledropComponent;
  let fixture: ComponentFixture<FiledropComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledropComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
