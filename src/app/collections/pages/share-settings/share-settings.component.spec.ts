import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSettingsComponent } from './share-settings.component';

describe('ShareSettingsComponent', () => {
  let component: ShareSettingsComponent;
  let fixture: ComponentFixture<ShareSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
