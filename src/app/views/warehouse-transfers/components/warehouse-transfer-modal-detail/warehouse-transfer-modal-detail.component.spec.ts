import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferModalDetailComponent } from './warehouse-transfer-modal-detail.component';

describe('WarehouseTransferModalDetailComponent', () => {
  let component: WarehouseTransferModalDetailComponent;
  let fixture: ComponentFixture<WarehouseTransferModalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferModalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferModalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
