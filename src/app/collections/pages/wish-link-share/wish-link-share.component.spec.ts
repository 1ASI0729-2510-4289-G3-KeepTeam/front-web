import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishLinkShareComponent } from './wish-link-share.component';

describe('WishLinkShareComponent', () => {
  let component: WishLinkShareComponent;
  let fixture: ComponentFixture<WishLinkShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishLinkShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishLinkShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
