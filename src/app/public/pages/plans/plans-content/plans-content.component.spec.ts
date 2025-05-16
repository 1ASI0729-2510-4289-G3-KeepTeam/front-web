import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansContentComponent } from './plans-content.component';

describe('PlansContentComponent', () => {
  let component: PlansContentComponent;
  let fixture: ComponentFixture<PlansContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
