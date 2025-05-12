import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishShareSettingsComponent } from './wish-share-settings.component';

describe('WishShareSettingsComponent', () => {
  let component: WishShareSettingsComponent;
  let fixture: ComponentFixture<WishShareSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishShareSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishShareSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
