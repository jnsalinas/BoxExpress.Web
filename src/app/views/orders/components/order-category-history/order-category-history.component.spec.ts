import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCategoryHistoryComponent } from './order-category-history.component';

describe('OrderCategoryHistoryComponent', () => {
  let component: OrderCategoryHistoryComponent;
  let fixture: ComponentFixture<OrderCategoryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCategoryHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCategoryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
