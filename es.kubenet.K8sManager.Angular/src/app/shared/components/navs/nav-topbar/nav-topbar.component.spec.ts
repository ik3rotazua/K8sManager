import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTopbarComponent } from './nav-topbar.component';

describe('NavTopbarComponent', () => {
  let component: NavTopbarComponent;
  let fixture: ComponentFixture<NavTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavTopbarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
