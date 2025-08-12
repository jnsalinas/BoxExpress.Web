import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { ProductLoansService } from '../../../services/product-loans.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { ProductVariantService } from '../../../services/product-variant.service';
import { ProductLoanDto } from '../../../models/product-loan.dto';
import { ProductLoanDetailDto } from '../../../models/product-loan-detail.dto';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { ProductVariantDto } from '../../../models/product-variant.dto';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
import { freeSet } from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';

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
    IconModule,
    IconDirective,
  ],
  templateUrl: './product-loan-create.component.html',
  styleUrl: './product-loan-create.component.scss',
})
export class ProductLoanCreateComponent implements OnInit {
  isLoading: boolean = false;
  isEditMode: boolean = false;
  loanId: number = 0;
  productLoanForm: FormGroup = new FormGroup({});
  warehouseOptions: WarehouseDto[] = [];
  productVariantOptions: ProductVariantDto[] = [];
  icons = freeSet;
  constructor(
    private fb: FormBuilder,
    private productLoansService: ProductLoansService,
    private warehouseService: WarehouseService,
    private warehouseinventories: WarehouseInventoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadWarehouses();
    
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loanId = Number(id);
      this.loadProductVariants();
      setTimeout(() => {
        this.loadLoanForEdit();
      }, 1000);
    }
  }

  private initializeForm(): void {
    this.productLoanForm = this.fb.group({
      warehouseId: [null, [Validators.required]],
      loanDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      responsibleName: ['', [Validators.required, Validators.minLength(2)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
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

  private loadLoanForEdit(): void {
    this.isLoading = true;
    this.productLoansService.getById(this.loanId).subscribe({
      next: (loan) => {
        // Cargar datos del préstamo en el formulario
        this.productLoanForm.patchValue({
          warehouseId: loan.warehouseId,
          loanDate: loan.loanDate ? new Date(loan.loanDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          responsibleName: loan.responsibleName,
          notes: loan.notes,
        });

        // Cargar detalles de productos
        if (loan.details && loan.details.length > 0) {
          loan.details.forEach(detail => {
            this.addProductItem();
            const lastIndex = this.productLoanItems.length - 1;
            this.productLoanItems.at(lastIndex).patchValue({
              productVariantId: detail.productVariantId,
              requestedQuantity: detail.requestedQuantity,
            });
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando préstamo para editar:', error);
        this.messageService.showError('Error al cargar el préstamo');
        this.isLoading = false;
      }
    });
  }

  private loadProductVariants(): void {
    this.productVariantOptions = [];
    this.warehouseinventories
      .getWarehouseInventories({ warehouseId: this.productLoanForm.value.warehouseId })
      .subscribe({
        next: (response) => {
          const options: any[] = [];
          response.data.forEach((element) => {
            element.variants.forEach((variant) => {
              options.push({
                ...variant, 
                displayName: `${variant.productName} - ${variant.name} - ${variant.sku} - ${variant.store?.name || ''}`
              });
              // options.push({...variant, displayName: `${variant.productName} - ${variant.name} - ${variant.sku} - ${variant.store?.name || ''}`});
            });
          });
       
          this.productVariantOptions = [...options];
        },
        error: (error) => {
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

    const productLoanData: ProductLoanDto = {
      id: this.isEditMode ? this.loanId : 0,
      name: 'Préstamo de productos',
      warehouseId: formValue.warehouseId,
      loanDate: new Date(formValue.loanDate),
      responsibleName: formValue.responsibleName,
      notes: formValue.notes,
      details: formValue.productLoanItems.map((item: ProductLoanDetailDto) => ({
        productVariantId: item.productVariantId,
        requestedQuantity: item.requestedQuantity,
      })),
    };  

    console.log('productLoanData', productLoanData);
    
    if (this.isEditMode) {
      // Modo edición
      this.productLoansService.update(this.loanId, productLoanData).subscribe({
        next: (response) => {
          this.messageService.showSuccess('Préstamo actualizado exitosamente');
          this.router.navigate(['/product-loans']);
        },
        error: (error) => {
          console.error('Error actualizando préstamo:', error);
          this.messageService.showError('Error al actualizar el préstamo');
          this.isLoading = false;
        },
      });
    } else {
      // Modo creación
      this.productLoansService.create(productLoanData).subscribe({
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
    setTimeout(() => {
      this.addProductItem();
    }, 500);
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
