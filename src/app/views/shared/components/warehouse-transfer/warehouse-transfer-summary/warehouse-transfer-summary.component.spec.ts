import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferSummaryComponent } from './warehouse-transfer-summary.component';

describe('WarehouseTransferSummaryComponent', () => {
  let component: WarehouseTransferSummaryComponent;
  let fixture: ComponentFixture<WarehouseTransferSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
