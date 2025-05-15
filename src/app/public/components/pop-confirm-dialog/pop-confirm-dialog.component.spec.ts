import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopConfirmDialogComponent } from './pop-confirm-dialog.component';

describe('PopConfirmDialogComponent', () => {
  let component: PopConfirmDialogComponent;
  let fixture: ComponentFixture<PopConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
