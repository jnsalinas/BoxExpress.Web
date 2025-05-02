import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ModalComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdrawal-request-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  templateUrl: './withdrawal-request-modal.component.html',
  styleUrl: './withdrawal-request-modal.component.scss',
})
export class WithdrawalRequestModalComponent {
  @Input() isVisible = false;
  @Input() availableBalance: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitWithdrawal = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      accountHolder: ['', Validators.required],
      document: ['', Validators.required],
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required],
      description: [''],
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (this.form.valid) {
      this.submitWithdrawal.emit(this.form.value);
    }
  }
}
