import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalRequestModalComponent } from './withdrawal-request-modal.component';

describe('WithdrawalRequestModalComponent', () => {
  let component: WithdrawalRequestModalComponent;
  let fixture: ComponentFixture<WithdrawalRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalRequestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
