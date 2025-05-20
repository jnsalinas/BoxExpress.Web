import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WarehouseInventoryDto } from '../../../../models/warehouse-inventory.dto';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective,
  ButtonModule,
  CardModule,
  ColComponent,
  FormModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  RowComponent,
  ThemeDirective,
} from '@coreui/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { UtcDatePipe } from '../../../../shared/pipes/utc-date.pipe';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';

@Component({
  standalone: true,
  selector: 'app-warehouse-inventory-item-edit-modal',
  imports: [
    CommonModule,
    ModalModule,
    ButtonModule,
    FormModule,
    CardModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ReactiveFormsModule,
    IconDirective,
    ButtonDirective,
    ThemeDirective,
    ColComponent,
    RowComponent,
    UtcDatePipe,
  ],
  templateUrl: './warehouse-inventory-item-edit-modal.component.html',
  styleUrl: './warehouse-inventory-item-edit-modal.component.scss',
})
export class WarehouseInventoryItemEditModalComponent implements OnInit {
  @Input() warehouseInventoryId!: number;
  warehouseInventoryItem!: WarehouseInventoryDto;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  warehouseInventoryForm: FormGroup = this.fb.group({});
  constructor(
    private fb: FormBuilder,
    private warehouseInventoryService: WarehouseInventoryService
  ) {}

  ngOnInit() {
    this.warehouseInventoryService
      .getById(this.warehouseInventoryId)
      .subscribe({
        next: (response) => {
          this.warehouseInventoryItem = response;
          this.initForm();
        },
        error: (error) => {
          console.error('Error fetching warehouse inventory item:', error);
        },
      });
  }

  initForm() {
    const product = this.warehouseInventoryItem?.productVariant?.product;
    const variant = this.warehouseInventoryItem?.productVariant;

    // console.log(
    //   'variant?.reservedQuantity',
    //   warehouseInventoryItem?.reservedQuantity
    // );

    this.warehouseInventoryForm = this.fb.group({
      productName: [product?.name || '', Validators.required],
      variantName: [variant?.name || '', Validators.required],
      productSku: [product?.sku || ''],
      variantSku: [variant?.sku || ''],
      shopifyProductId: [product?.shopifyProductId || ''],
      shopifyVariantId: [variant?.shopifyVariantId || ''],
      price: [variant?.price || 0],
      quantity: [
        this.warehouseInventoryItem?.quantity || 0,
        [
          Validators.required,
          Validators.min(this.warehouseInventoryItem?.reservedQuantity || 0),
        ],
      ],
      notes: ['', Validators.required],
    });
  }

  close() {
    this.onClose.emit();
  }

  save() {
    if (this.warehouseInventoryForm.valid) {
      this.onSave.emit(this.warehouseInventoryForm.value);
    } else {
      console.log('Formulario inválido:', this.warehouseInventoryForm.value);
    }
  }

  reject() {
    this.onReject.emit();
  }
}
