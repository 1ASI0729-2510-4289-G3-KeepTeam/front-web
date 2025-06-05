import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOptionsMenuComponent} from './entity-options-menu.component';

describe('EntityOptionsMenuComponent', () => {
  let component: EntityOptionsMenuComponent;
  let fixture: ComponentFixture<EntityOptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityOptionsMenuComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntityOptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
