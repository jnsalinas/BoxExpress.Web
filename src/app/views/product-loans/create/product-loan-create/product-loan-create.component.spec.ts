import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLoanCreateComponent } from './product-loan-create.component';

describe('ProductLoanCreateComponent', () => {
  let component: ProductLoanCreateComponent;
  let fixture: ComponentFixture<ProductLoanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLoanCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLoanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
