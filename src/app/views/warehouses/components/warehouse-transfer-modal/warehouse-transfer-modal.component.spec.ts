import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferModalComponent } from './warehouse-transfer-modal.component';

describe('WarehouseTransferModalComponent', () => {
  let component: WarehouseTransferModalComponent;
  let fixture: ComponentFixture<WarehouseTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
