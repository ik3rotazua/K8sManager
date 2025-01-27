import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCopyTextComponent } from './btn-copy-text.component';

describe('BtnCopyTextComponent', () => {
  let component: BtnCopyTextComponent;
  let fixture: ComponentFixture<BtnCopyTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnCopyTextComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCopyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
