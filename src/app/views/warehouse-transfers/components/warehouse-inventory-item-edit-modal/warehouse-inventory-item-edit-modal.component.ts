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
import { freeSet } from '@coreui/icons';
import { UtcDatePipe } from '../../../../shared/pipes/utc-date.pipe';
import { WarehouseInventoryService } from '../../../../services/warehouse-inventory.service';
import { StoreService } from '../../../../services/store.service';
import { StoreDto } from '../../../../models/store.dto';
import { NgSelectModule } from '@ng-select/ng-select';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';

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
    NgSelectModule,
    HasRoleDirective
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
  isSaving = false;
  icons = freeSet;
  stores: StoreDto[] = [];
  
  constructor(
    private fb: FormBuilder,
    private warehouseInventoryService: WarehouseInventoryService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.loadStores();
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

  loadStores() {
    this.storeService.getAll({ isAll: true }).subscribe({
      next: (response) => {
        this.stores = response.data;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
      },
    });
  }

  initForm() {
    const variant = this.warehouseInventoryItem?.productVariant;

    this.warehouseInventoryForm = this.fb.group({
      // productName: [variant?.productName || '', Validators.required],
      variantName: [variant?.name || '', Validators.required],
      // productSku: [variant?.productSku || '', Validators.required],
      variantSku: [variant?.sku || '', Validators.required],
      shopifyVariantId: [variant?.shopifyVariantId || ''],
      price: [variant?.price || 0, [Validators.required, Validators.min(0)]],
      quantity: [
        this.warehouseInventoryItem?.quantity || 0,
        [Validators.required, Validators.min(0)],
      ],
      addQuantity: [0, [Validators.required, Validators.min(0)]],
      storeId: [{
        value: this.warehouseInventoryItem?.store?.id || null,
        disabled: !!this.warehouseInventoryItem?.store?.id
      }],
    });
  }

  close() {
    this.onClose.emit();
  }

  save() {
    if (this.warehouseInventoryForm.valid) {
      this.isSaving = true;
      
      // Modelo plano para enviar al backend
      const formData = this.warehouseInventoryForm.value;
      const submitData = {
        id: this.warehouseInventoryId,
        // productName: formData.productName,
        variantName: formData.variantName,
        // productSku: formData.productSku,
        variantSku: formData.variantSku,
        shopifyVariantId: formData.shopifyVariantId,
        price: formData.price,
        quantity: formData.quantity,
        storeId: formData.storeId,
      };
      
      this.onSave.emit(submitData);
    } else {
      console.log('Formulario inválido:', this.warehouseInventoryForm.value);
    }
  }

  // Método para resetear el estado de guardado (llamado desde el componente padre)
  resetSavingState() {
    this.isSaving = false;
  }

  reject() {
    this.onReject.emit();
  }

  getTotalWithAddition(){
    return (this.warehouseInventoryForm.value.quantity ?? 0) + (this.warehouseInventoryForm.value.addQuantity ?? 0) || 0;
  }
}
