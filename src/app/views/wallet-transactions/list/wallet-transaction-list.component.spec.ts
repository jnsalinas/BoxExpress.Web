import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransactionListComponent } from './wallet-transaction-list.component';

describe('WalletTransactionListComponent', () => {
  let component: WalletTransactionListComponent;
  let fixture: ComponentFixture<WalletTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTransactionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
