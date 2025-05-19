import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemDetailComponent } from './inventory-item-detail.component';

describe('InventoryItemDetailComponent', () => {
  let component: InventoryItemDetailComponent;
  let fixture: ComponentFixture<InventoryItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
