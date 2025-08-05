import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoadingOverlayComponent } from '../../../../shared/components/loading-overlay/loading-overlay.component';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal.component';
import { ProductLoansService } from '../../../../services/product-loans.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { ProductVariantService } from '../../../../services/product-variant.service';
import { ProductLoansDto } from '../../../../models/product-loan.dto';
import { ProductLoanDetailDto } from '../../../../models/product-loan-detail.dto';
import { WarehouseDto } from '../../../../models/warehouse.dto';
import { ProductVariantDto } from '../../../../models/product-variant.dto';
import { MessageService } from '../../../../services/message.service';
import { Router } from '@angular/router';
import { WarehouseInventoryService } from '../../../../services/warehouse-inventory.service';

@Component({
  selector: 'app-product-loan-create',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NgSelectModule,
    ReactiveFormsModule,
    LoadingOverlayComponent,
    GenericModalComponent,
    RouterLink,
  ],
  templateUrl: './product-loan-create.component.html',
  styleUrl: './product-loan-create.component.scss',
})
export class ProductLoanCreateComponent implements OnInit {
  isLoading: boolean = false;
  productLoanForm: FormGroup = new FormGroup({});
  warehouseOptions: WarehouseDto[] = [];
  productVariantOptions: ProductVariantDto[] = [];

  constructor(
    private fb: FormBuilder,
    private productLoansService: ProductLoansService,
    private warehouseService: WarehouseService,
    private warehouseinventories: WarehouseInventoryService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  private initializeForm(): void {
    this.productLoanForm = this.fb.group({
      warehouseId: [null, [Validators.required]],
      loanDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      responsibleName: ['', [Validators.required, Validators.minLength(2)]],
      notes: ['', [Validators.required, Validators.minLength(10)]],
      productLoanItems: this.fb.array([]),
    });
  }

  private loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (response) => {
        this.warehouseOptions = response.data || [];
      },
      error: (error) => {
        console.error('Error cargando bodegas:', error);
        this.messageService.showError('Error al cargar las bodegas');
      },
    });
  }

  private loadProductVariants(): void {
    this.warehouseinventories
      .getWarehouseInventories({ warehouseId: this.productLoanForm.value.warehouseId })
      .subscribe({
        next: (response) => {
          response.data.forEach((element) => {
            element.variants.forEach((variant) => {
              this.productVariantOptions.push({...variant, displayName: `${variant.productName} - ${variant.name} - ${variant.sku} - ${variant.store?.name || ''}`});
            });
          });
       
          console.log(this.productVariantOptions);
          this.addProductItem();
        },
        error: (error) => {
          console.error('Error cargando variantes de productos:', error);
          this.messageService.showError('Error al cargar los productos');
        },
      });
  }

  get productLoanItems(): FormArray {
    return this.productLoanForm.get('productLoanItems') as FormArray;
  }

  addProductItem(): void {
    const productItem = this.fb.group({
      productVariantId: [null, [Validators.required]],
      requestedQuantity: [null, [Validators.required, Validators.min(1)]],
      max: [null], // Campo para almacenar la cantidad máxima disponible
    });

    this.productLoanItems.push(productItem);
  }

  removeProductItem(index: number): void {
    this.productLoanItems.removeAt(index);
  }

  getProductVariantControl(index: number) {
    return this.productLoanItems
      .at(index)
      .get('productVariantId') as FormControl;
  }

  getRequestedQuantityControl(index: number) {
    return this.productLoanItems
      .at(index)
      .get('requestedQuantity') as FormControl;
  }

  getMaxControl(index: number) {
    return this.productLoanItems
      .at(index)
      .get('max') as FormControl;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productLoanForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isProductFieldInvalid(index: number, fieldName: string): boolean {
    const item = this.productLoanItems.at(index);
    const field = item.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getProductFieldError(index: number, fieldName: string): string {
    const item = this.productLoanItems.at(index);
    const field = item.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;
    }
    return 'Campo inválido';
  }

  getFieldError(fieldName: string): string {
    const field = this.productLoanForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min'])
        return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `El valor máximo es ${field.errors['max'].max}`;
    }
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.productLoanForm.invalid || this.productLoanItems.length === 0) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.productLoanForm.value;

    const productLoanData = {
      warehouseId: formValue.warehouseId,
      loanDate: new Date(formValue.loanDate),
      responsibleName: formValue.responsibleName,
      notes: formValue.notes,
      productLoanItems: formValue.productLoanItems.map((item: any) => ({
        productVariantId: item.productVariantId,
        requestedQuantity: item.requestedQuantity,
      })),
    };

    this.productLoansService.create(productLoanData as any).subscribe({
      next: (response) => {
        this.messageService.showSuccess('Préstamo creado exitosamente');
        this.router.navigate(['/product-loans']);
      },
      error: (error) => {
        console.error('Error creando préstamo:', error);
        this.messageService.showError('Error al crear el préstamo');
        this.isLoading = false;
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productLoanForm.controls).forEach((key) => {
      const control = this.productLoanForm.get(key);
      control?.markAsTouched();
    });

    this.productLoanItems.controls.forEach((control) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((key) => {
          const field = control.get(key);
          field?.markAsTouched();
        });
      }
    });
  }

  onWarehouseChange(event: any): void {
    console.log('onWarehouseChange triggered:', event);
    this.productLoanItems.clear();
    this.loadProductVariants();
  }

  onProductVariantSelected(variant: ProductVariantDto, index: number): void {
    if (variant) {
      const maxAvailable = variant.availableQuantity ?? 1;
      const quantityControl = this.getRequestedQuantityControl(index);
      const maxControl = this.getMaxControl(index);

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
}
