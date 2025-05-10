import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionProductsPageComponent } from './collection-products-page.component';

describe('CollectionProductsPageComponent', () => {
  let component: CollectionProductsPageComponent;
  let fixture: ComponentFixture<CollectionProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
