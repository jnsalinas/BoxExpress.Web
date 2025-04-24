import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditModalComponent } from './order-edit-modal.component';

describe('OrderEditModalComponent', () => {
  let component: OrderEditModalComponent;
  let fixture: ComponentFixture<OrderEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
