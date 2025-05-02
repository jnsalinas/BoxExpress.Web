import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalRequestListComponent } from './withdrawal-request-list.component';

describe('WithdrawalRequestListComponent', () => {
  let component: WithdrawalRequestListComponent;
  let fixture: ComponentFixture<WithdrawalRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
