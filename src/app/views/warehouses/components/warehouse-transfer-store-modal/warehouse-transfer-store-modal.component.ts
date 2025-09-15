import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  FormModule,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalModule,
  CardModule,
  ModalFooterComponent,
} from '@coreui/angular';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { freeSet } from '@coreui/icons';
import { ProductVariantService } from '../../../../services/product-variant.service';
import { ProductVariantAutocompleteDto } from 'src/app/models/product-variant-autocomplete.dto';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
import { debounceTime, Subject } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';
import { StoreDto } from 'src/app/models/store.dto';

@Component({
  selector: 'app-warehouse-transfer-store-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconDirective,
    IconModule,
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
  standalone: true,
  templateUrl: './warehouse-transfer-store-modal.component.html',
  styleUrl: './warehouse-transfer-store-modal.component.scss',
})
export class WarehouseTransferStoreModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  variantInputSubjects: Subject<string>[] = [];
  icons = freeSet;
  form: FormGroup = this.fb.group({});
  submitted = false;
  isLoading = false;
  variantOptions: ProductVariantAutocompleteDto[][] = [];
  isLoadingVariant: boolean[] = [];
  warehouseId: number = 0;
  stores: StoreDto[] = [];

  constructor(
    private fb: FormBuilder,
    private warehouseInventoriesService: WarehouseInventoryService,
    private storeService: StoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.warehouseId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
    this.form = this.fb.group({
      transferDetails: this.fb.array([]),
    });

    this.getStores();
    this.addTransferDetail();
  }

  getStores() {
    this.storeService.getAll({ isAll: true }).subscribe((response) => {
      this.stores = response.data;
    });
  }

  get transferDetails(): FormArray {
    return this.form.get('transferDetails') as FormArray;
  }

  addTransferDetail() {
    const index = this.transferDetails.length;
    this.transferDetails.push(
      this.fb.group(
        {
          storeId: [null, Validators.required],
          fromStoreId: [null, Validators.required],
          fromStoreName: [null, Validators.required],
          productVariantId: [null, Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
          max: [null],
        },
        { validators: [this.storesMustDifferValidator()] }
      )
    );
    this.variantOptions.push([]);
    this.isLoadingVariant.push(false);

    const subject = new Subject<string>();
    subject.pipe(debounceTime(300)).subscribe((term) => {
      this.fetchVariants(term, index);
    });

    this.variantInputSubjects.push(subject);
  }

  removeTransferDetail(index: number) {
    this.transferDetails.removeAt(index);
  }

  close() {
    this.onClose.emit();
  }

  save() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onSave.emit(this.form.value);
    this.resetForm();
    this.resetLoading();
  }

  resetForm() {
    this.form.reset();
    this.submitted = false;
    this.resetLoading();
  }

  resetLoading() {
    this.isLoading = false;
    this.submitted = false;
    this.form.reset();
  }

  fetchVariants(term: string, index: number): void {
    if (!term || term.length < 2) {
      this.variantOptions[index] = [];
      return;
    }

    this.isLoadingVariant[index] = true;
    this.warehouseInventoriesService
      .autocomplete(term, this.warehouseId)
      .subscribe({
        next: (matches) => {
          this.variantOptions[index] = matches;

          this.isLoadingVariant[index] = false;
        },
        error: (err) => {
          this.isLoadingVariant[index] = false;
        },
      });
  }

  getVariantOptions(index: number): ProductVariantAutocompleteDto[] {
    this.variantOptions[index].forEach((option) => {
      option.displayName = `${option.productName || ''} - ${
        option.name || ''
      } - ${option.availableUnits || ''
      } - ${option.storeName || ''}`;
    });
    return this.variantOptions[index] || [];
  }

  onVariantSelected(
    variant: ProductVariantAutocompleteDto,
    index: number
  ): void {
    if (variant) {
      const maxAvailable = variant.availableUnits ?? 1; // por si quantity viene undefined
      const quantityControl = this.transferDetails.at(index).get('quantity');
      const maxControl = this.transferDetails.at(index).get('max');
      const fromStoreNameControl = this.transferDetails.at(index).get('fromStoreName');
      const fromStoreIdControl = this.transferDetails.at(index).get('fromStoreId');

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

      if (fromStoreNameControl) {
        fromStoreNameControl.setValue(variant.storeName);
      }

      if (fromStoreIdControl) {
        fromStoreIdControl.setValue(variant.storeId);
      }

      // Revalidar el grupo del detalle por si la tienda destino coincide con la de origen
      const detailGroup = this.transferDetails.at(index) as FormGroup;
      detailGroup.updateValueAndValidity();
    }
  }

  private storesMustDifferValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const storeId = group.get('storeId')?.value;
      const fromStoreId = group.get('fromStoreId')?.value;
      if (storeId && fromStoreId && storeId === fromStoreId) {
        return { storesMustDiffer: true };
      }
      return null;
    };
  }
}
