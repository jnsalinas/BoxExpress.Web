import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { debounceTime } from 'rxjs/operators';
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
import { WarehouseFilter } from '../../../../models/warehouse-filter.model';
import { WarehouseService } from '../../../../services/warehouse.service';
import { ProductVariantService } from '../../../../services/product-variant.service';
import { Subject } from 'rxjs';
import { ProductVariantAutocompleteDto } from '../../../../models/product-variant-autocomplete.dto';

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
    NgSelectModule,
    NgSelectComponent,
  ],
})
export class WarehouseTransferModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() variantsList: ProductVariantDto[] = [];
  @Input() warehouseId: number = 0;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  form: FormGroup;
  variantInputSubjects: Subject<string>[] = [];
  variantOptions: ProductVariantAutocompleteDto[][] = [];
  warehouses: WarehouseDto[] = [];
  loading = false;
  isLoadingVariant: boolean[] = [];

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
    this.isLoadingVariant.push(false);

    const subject = new Subject<string>();
    subject.pipe(debounceTime(300)).subscribe((term) => {
      this.fetchVariants(term, this.lines.length - 1);
    });

    this.variantInputSubjects.push(subject);
  }

  onVariantSearch(term: string, index: number): void {
    this.variantInputSubjects[index].next(term);
  }

  private fetchVariants(term: string, index: number): void {
    if (!term || term.length < 2) {
      this.variantOptions[index] = [];
      return;
    }

    this.isLoadingVariant[index] = true;
    this.productVariantService.autocomplete(term, this.warehouseId).subscribe({
      next: (matches) => {
        this.variantOptions[index] = matches.filter(
          (v) => !this.isDuplicate(v.id, index)
        );
        this.isLoadingVariant[index] = false;
      },
      error: (err) => {
        console.error('Autocomplete error:', err);
        this.isLoadingVariant[index] = false;
      },
    });
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
    this.variantOptions.splice(index, 1);
    this.variantInputSubjects.splice(index, 1);
    this.isLoadingVariant.splice(index, 1);
  }

  onVariantSelected(variantId: number, index: number): void {
    console.log('Variant selected:', variantId);
    if (this.isDuplicate(variantId, index)) {
      this.lines.at(index).get('variantId')?.reset();
      alert('Esta variante ya fue seleccionada en otra línea.');
    }
  }

  onVariantInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();

    if (value.length < 2) {
      this.variantOptions[index] = [];
      return;
    }

    this.productVariantService.autocomplete(value, this.warehouseId).subscribe({
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
      },
    });
  }

  getVariantOptions(index: number): ProductVariantAutocompleteDto[] {
    this.variantOptions[index].forEach((option) => {
      option.displayName = `${option.productName || ''} - ${option.name || ''} - ${option.availableUnits || ''}`;
    });
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
