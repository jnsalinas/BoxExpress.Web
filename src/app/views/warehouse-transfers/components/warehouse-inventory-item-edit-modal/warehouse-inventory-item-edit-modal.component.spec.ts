import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryItemEditModalComponent } from './warehouse-inventory-item-edit-modal.component';

describe('WarehouseInventoryItemEditModalComponent', () => {
  let component: WarehouseInventoryItemEditModalComponent;
  let fixture: ComponentFixture<WarehouseInventoryItemEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseInventoryItemEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInventoryItemEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
