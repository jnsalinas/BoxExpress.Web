import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferStoreModalComponent } from './warehouse-transfer-store-modal.component';

describe('WarehouseTransferStoreModalComponent', () => {
  let component: WarehouseTransferStoreModalComponent;
  let fixture: ComponentFixture<WarehouseTransferStoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferStoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
