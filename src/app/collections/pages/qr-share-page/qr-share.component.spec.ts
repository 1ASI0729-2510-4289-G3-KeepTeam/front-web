import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrShareComponent } from './qr-share.component';

describe('WishQrSharePageComponent', () => {
  let component: QrShareComponent;
  let fixture: ComponentFixture<QrShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
