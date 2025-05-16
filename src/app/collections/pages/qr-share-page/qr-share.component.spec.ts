import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishQrSharePageComponent } from './qr-share.component';

describe('WishQrSharePageComponent', () => {
  let component: WishQrSharePageComponent;
  let fixture: ComponentFixture<WishQrSharePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishQrSharePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishQrSharePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
