import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusHistoryComponent } from './order-status-history.component';

describe('OrderStatusHistoryComponent', () => {
  let component: OrderStatusHistoryComponent;
  let fixture: ComponentFixture<OrderStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
