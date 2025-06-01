import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashcanComponent } from './trashcan.component';

describe('TrashcanComponent', () => {
  let component: TrashcanComponent;
  let fixture: ComponentFixture<TrashcanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashcanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashcanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
