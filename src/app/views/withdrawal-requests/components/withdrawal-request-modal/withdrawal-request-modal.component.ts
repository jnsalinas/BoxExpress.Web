import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { StoreDto } from '../../../../models/store.dto';
import { StoreService } from '../../../../services/store.service';
import { WithdrawalRequestDto } from 'src/app/models/withdrawal-request.dto';
import { DocumentTypeService } from '../../../../services/document-type.service';
import { DocumentTypeDto } from '../../../../models/document-type.dto';
import { WithdrawalRequestStatus } from 'src/app/constants/withdrawal-request-status';

@Component({
  selector: 'app-withdrawal-request-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    NgSelectModule,
    NgSelectComponent,
  ],
  templateUrl: './withdrawal-request-modal.component.html',
  styleUrl: './withdrawal-request-modal.component.scss',
})
export class WithdrawalRequestModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() availableBalance: number = 0;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onApprove = new EventEmitter<{ id: number; reason: string }>();
  @Output() onReject = new EventEmitter<{ id: number; reason: string }>();
  stores: StoreDto[] = [];
  documentTypes: DocumentTypeDto[] = [];
  form: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  isPending: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private documentTypeService: DocumentTypeService
  ) {}

  private _withdrawalRequest: WithdrawalRequestDto | null = null;
  @Input() set withdrawalRequest(value: WithdrawalRequestDto | null) {
    this._withdrawalRequest = value;
    if (value && this.form) {
      this.form.patchValue(value);
      this.isPending = value.status == WithdrawalRequestStatus.Pending;
      this.form.disable();

      if (this.isPending) {
        this.form.get('reason')?.enable();
        this.form.get('id')?.enable();
      }
    } else {
      this.isPending = false;
      this.form.enable();
    }
  }

  get withdrawalRequest(): WithdrawalRequestDto | null {
    return this._withdrawalRequest;
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      amount: [null, [Validators.required, Validators.min(1)]],
      accountHolder: ['', Validators.required],
      documentTypeId: ['', Validators.required],
      document: ['', Validators.required],
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required],
      description: [''],
      storeId: ['', Validators.required],
      reason: [''],
    });

    this.loadStores();
    this.loadDocumentTypes();
  }

  loadStores() {
    this.isLoading = true;
    this.storeService.getAll({}).subscribe({
      next: (response) => {
        this.stores = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  loadDocumentTypes() {
    this.isLoading = true;
    this.documentTypeService.getAll({}).subscribe({
      next: (response) => {
        this.documentTypes = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  close(): void {
    this.onClose.emit();
    this.form.reset();
  }

  save(): void {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
      this.form.reset();
    }
  }

  approve(): void {
    this.onApprove.emit({
      id: this.form.value.id,
      reason: this.form.value.reason,
    });
  }

  reject(): void {
    this.onReject.emit({
      id: this.form.value.id,
      reason: this.form.value.reason,
    });
  }
}
