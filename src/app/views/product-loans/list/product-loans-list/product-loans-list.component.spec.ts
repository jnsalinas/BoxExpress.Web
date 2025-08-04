import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLoansListComponent } from './product-loans-list.component';

describe('ProductLoansListComponent', () => {
  let component: ProductLoansListComponent;
  let fixture: ComponentFixture<ProductLoansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLoansListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLoansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
