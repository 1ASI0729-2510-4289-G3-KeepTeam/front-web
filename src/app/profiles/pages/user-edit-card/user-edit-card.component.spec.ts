import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditCardComponent } from './user-edit-card.component';

describe('UserEditCardComponent', () => {
  let component: UserEditCardComponent;
  let fixture: ComponentFixture<UserEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
