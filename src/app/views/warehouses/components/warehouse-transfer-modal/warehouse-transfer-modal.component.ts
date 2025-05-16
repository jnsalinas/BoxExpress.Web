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
import { WarehouseDto } from '../../../../models/warehouse.dto';
import { WarehouseService } from '../../../../services/warehouse.service';
import { Subject } from 'rxjs';
import { ProductVariantAutocompleteDto } from '../../../../models/product-variant-autocomplete.dto';
import { freeSet } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { WarehouseInventoriesService } from '../../../../services/warehouse-inventories.service';
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
  @Input() warehouseId: number = 0;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  variantsList: ProductVariantAutocompleteDto[] = [];
  form: FormGroup = this.fb.group({});
  variantInputSubjects: Subject<string>[] = [];
  variantOptions: ProductVariantAutocompleteDto[][] = [];
  warehouses: WarehouseDto[] = [];
  loading = false;
  isLoadingVariant: boolean[] = [];
  icons = freeSet;
  summaryList: { id: number; name: string; quantity: number }[] = [];
  selectedWarehouseName: string = '';

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private warehouseInventoriesService: WarehouseInventoriesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      toWarehouseId: [null, Validators.required],
      transferDetails: this.fb.array([]),
    });

    this.loadWarehouses();

    if (this.transferDetails.length === 0) {
      this.addProductVariant();
    }

    this.form.valueChanges.subscribe(() => {
      this.updateSummary();
    });
  }

  onWarehouseChange(event: WarehouseDto) {
    this.selectedWarehouseName = event ? event.name : 'No seleccionada';
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getAll({}).subscribe({
      next: (result) => {
        this.warehouses = result.data.filter(
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

  get transferDetails(): FormArray {
    return this.form.get('transferDetails') as FormArray;
  }

  addProductVariant(): void {
    const variant = this.fb.group({
      productVariantId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      max: [null],
    });

    const index = this.transferDetails.length;

    this.transferDetails.push(variant);
    this.variantOptions.push([]);
    this.isLoadingVariant.push(false);

    const subject = new Subject<string>();
    subject.pipe(debounceTime(300)).subscribe((term) => {
      this.fetchVariants(term, index);
    });

    this.variantInputSubjects.push(subject);
  }

  removeProductVariant(index: number): void {
    this.transferDetails.removeAt(index);
    this.variantOptions.splice(index, 1);
    this.variantInputSubjects.splice(index, 1);
    this.isLoadingVariant.splice(index, 1);
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
    this.warehouseInventoriesService.autocomplete(term, this.warehouseId).subscribe({
      next: (matches) => {
        this.variantOptions[index] = matches.filter(
          (v) => !this.isDuplicate(v.id, index)
        );

        for (const match of matches) {
          if (!this.variantsList.find((v) => v.id === match.id)) {
            this.variantsList.push(match);
          }
        }

        this.isLoadingVariant[index] = false;
      },
      error: (err) => {
        console.error('Autocomplete error:', err);
        this.isLoadingVariant[index] = false;
      },
    });
  }

  onVariantSelected(
    variant: ProductVariantAutocompleteDto,
    index: number
  ): void {
    if (this.isDuplicate(variant.id, index)) {
      this.transferDetails.at(index).get('productVariantId')?.reset();
      alert('Esta variante ya fue seleccionada en otra línea.');
    }

    if (variant) {
      const maxAvailable = variant.availableUnits ?? 1; // por si quantity viene undefined
      const quantityControl = this.transferDetails.at(index).get('quantity');
      const maxControl = this.transferDetails.at(index).get('max');

      if (quantityControl) {
        quantityControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(maxAvailable),
        ]);
        quantityControl.updateValueAndValidity();
      }

      if (maxControl) {
        maxControl.setValue(maxAvailable);
      }
    }
  }

  getVariantOptions(index: number): ProductVariantAutocompleteDto[] {
    console.log(this.variantOptions, index);
    this.variantOptions[index].forEach((option) => {
      option.displayName = `${option.productName || ''} - ${
        option.name || ''
      } - ${option.availableUnits || ''}`;
    });
    return this.variantOptions[index] || [];
  }

  isDuplicate(productVariantId: number, currentIndex: number): boolean {
    return this.transferDetails.controls.some(
      (control, index) =>
        index !== currentIndex && control.get('productVariantId')?.value === productVariantId
    );
  }

  private updateSummary(): void {
    console.log('updateSummary;', this.transferDetails.controls);
    this.summaryList = this.transferDetails.controls
      .map((control) => {
        const productVariantId = control.get('productVariantId')?.value;
        const quantity = control.get('quantity')?.value;
        const variant = this.variantsList.find((v) => v.id === productVariantId)!;
        return productVariantId
          ? { id: productVariantId, name: variant.displayName, quantity }
          : null;
      })
      .filter(
        (item): item is { id: number; name: string; quantity: number } => !!item
      );

    console.log(this.summaryList);
  }

  save(): void {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
      // this.resetForm(); todo: descomentar
    } else {
      console.log('Formulario inválido:', this.form.value);
    }
  }

  close(): void {
    this.onClose.emit();
  }

  private resetForm(): void {
    this.form.reset();
    this.transferDetails.clear();
    this.variantOptions = [];
    this.summaryList = [];
    this.addProductVariant();
  }
}
