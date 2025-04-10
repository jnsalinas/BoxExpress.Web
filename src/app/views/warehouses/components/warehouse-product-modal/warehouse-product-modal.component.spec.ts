import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseProductModalComponent } from './warehouse-product-modal.component';

describe('WarehouseProductModalComponent', () => {
  let component: WarehouseProductModalComponent;
  let fixture: ComponentFixture<WarehouseProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseProductModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
