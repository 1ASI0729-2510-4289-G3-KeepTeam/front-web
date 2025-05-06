import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishEditItemComponent } from './wish-edit-item.component';

describe('WishItemComponent', () => {
  let component: WishEditItemComponent;
  let fixture: ComponentFixture<WishEditItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishEditItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishEditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
