import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ModalModule,
  ButtonModule,
  FormModule,
  CardModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProductVariantDto } from '../../../../models/product-variant.dto';
import { WarehouseDto } from '../../../../models/warehouse.dto';
import { WarehouseFilter } from 'src/app/models/warehouse-filter.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { ProductVariantService } from 'src/app/services/product-variant.service';

@Component({
  selector: 'app-warehouse-transfer-modal',
  standalone: true,
  templateUrl: './warehouse-transfer-modal.component.html',
  styleUrl: './warehouse-transfer-modal.component.scss',
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
  ],
})
export class WarehouseTransferModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() variantsList: ProductVariantDto[] = [];
  @Input() warehouseId: number | null = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  form: FormGroup;
  variantOptions: ProductVariantDto[][] = [];
  warehouses: WarehouseDto[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private productVariantService: ProductVariantService
  ) {
    this.form = this.fb.group({
      destinationWarehouseId: [null, Validators.required],
      lines: this.fb.array([]),
    });
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getAll({}).subscribe({
      next: (data) => {
        this.warehouses = data.filter(
          (warehouse) => warehouse.id !== this.warehouseId
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading warehouses', err);
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {
    if (this.lines.length === 0) {
      this.addLine();
    }
  }

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  addLine(): void {
    const line = this.fb.group({
      variantId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    this.lines.push(line);
    this.variantOptions.push([]);
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
    this.variantOptions.splice(index, 1);
  }

  onVariantInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
  
    if (value.length < 2) {
      this.variantOptions[index] = [];
      return;
    }
  
    this.productVariantService.autocomplete(value).subscribe({
      next: (matches) => {
        this.variantOptions[index] = matches.filter(
          (v) => !this.isDuplicate(v.id, index)
        );
  
        const exact = matches.find((v) => v.name.toLowerCase() === value);
        if (exact) {
          this.lines.at(index).get('variantId')?.setValue(exact.id);
        }
      },
      error: (err) => {
        console.error('Autocomplete error:', err);
      }
    });
  }
  

  getVariantOptions(index: number): ProductVariantDto[] {
    return this.variantOptions[index] || [];
  }

  displayVariant(variantId: number | null): string {
    const variant = this.variantsList.find((v) => v.id === variantId);
    return variant ? variant.name : '';
  }

  isDuplicate(variantId: number, currentIndex: number): boolean {
    return this.lines.controls.some(
      (control, index) =>
        index !== currentIndex && control.get('variantId')?.value === variantId
    );
  }

  getSummary(): { name: string; quantity: number }[] {
    return this.lines.controls
      .map((control) => {
        const variantId = control.get('variantId')?.value;
        const quantity = control.get('quantity')?.value;
        const variant = this.variantsList.find((v) => v.id === variantId);
        return variant ? { name: variant.name, quantity } : null;
      })
      .filter((item): item is { name: string; quantity: number } => !!item);
  }

  save(): void {
    this.onSave.emit(this.form.value); //todo quitar

    if (this.form.valid) {
      this.onSave.emit(this.form.value);
      this.resetForm();
    } else {
      console.log('Formulario inválido:', this.form.value);
    }
  }

  close(): void {
    console.log('Modal closed');
    // this.resetForm();
    this.onClose.emit();
  }

  private resetForm(): void {
    this.form.reset();
    this.lines.clear();
    this.variantOptions = [];
    this.addLine();
  }
}
