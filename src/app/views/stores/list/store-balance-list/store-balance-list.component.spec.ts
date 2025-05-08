import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBalanceListComponent } from './store-balance-list.component';

describe('StoreBalanceListComponent', () => {
  let component: StoreBalanceListComponent;
  let fixture: ComponentFixture<StoreBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreBalanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
