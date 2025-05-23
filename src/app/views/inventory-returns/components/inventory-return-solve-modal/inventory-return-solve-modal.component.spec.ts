import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReturnSolveModalComponent } from './inventory-return-solve-modal.component';

describe('InventoryReturnSolveModalComponent', () => {
  let component: InventoryReturnSolveModalComponent;
  let fixture: ComponentFixture<InventoryReturnSolveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryReturnSolveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReturnSolveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
