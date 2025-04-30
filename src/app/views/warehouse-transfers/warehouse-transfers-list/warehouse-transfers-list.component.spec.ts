import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransfersListComponent } from './warehouse-transfers-list.component';

describe('WarehouseTransfersListComponent', () => {
  let component: WarehouseTransfersListComponent;
  let fixture: ComponentFixture<WarehouseTransfersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransfersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransfersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
