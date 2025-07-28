import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent,
  ButtonDirective,
} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CityService } from '../../../../services/city.service';
import { CityDto } from '../../../../models/city.dto';
import { StoreDto } from '../../../../models/store.dto';
import { forkJoin } from 'rxjs';
import { StoreService } from '../../../../services/store.service';
import { OrderStatusService } from '../../../../services/order-status.service';
import { OrderStatusDto } from '../../../../models/order-status.dto';
import { LoadingOverlayComponent } from '../../../../shared/components/loading-overlay/loading-overlay.component';
import { CurrencyService } from '../../../../services/currency.service';
import { CurrencyDto } from '../../../../models/currency.dto';
import { NgSelectModule } from '@ng-select/ng-select';
import { WarehouseInventoryService } from '../../../../services/warehouse-inventory.service';
import { ProductVariantDto } from '../../../../models/product-variant.dto';
import { AuthService } from '../../../../services/auth.service';
import { OrderService } from '../../../../services/order.service';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    LoadingOverlayComponent,
    NgSelectModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  isLoading: boolean = false;
  form!: FormGroup;
  cities: CityDto[] = [];
  stores: StoreDto[] = [];
  statuses: OrderStatusDto[] = [];
  currencies: CurrencyDto[] = [];
  productVariants: ProductVariantDto[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cityService: CityService,
    private storeService: StoreService,
    private orderStatusService: OrderStatusService,
    private currencyService: CurrencyService,
    private warehouseInventoryService: WarehouseInventoryService,
    public authService: AuthService,
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.buildForm();
  }

  getData() {
    this.isLoading = true;

    forkJoin({
      cities: this.cityService.getAll({}),
      stores: this.storeService.getAll({ isAll: true }),
      statuses: this.orderStatusService.getAll(),
      currencies: this.currencyService.getAll(),
      // categories: this.orderCategoryService.getAll(),
      // warehouses: this.warehouseService.getAll(),
    }).subscribe({
      next: (responses) => {
        this.cities = responses.cities.data;
        this.stores = responses.stores.data;
        this.statuses = responses.statuses.data;
        this.currencies = responses.currencies.data;
        // Set first city as default and disable cityId
        if (this.cities.length > 0) {
          this.form?.get('cityId')?.setValue(this.cities[0].id);
        }

        // If user is tienda, disable storeId control and deliveryFee
        if (this.authService.hasRole('tienda')) {
          this.form?.get('storeId')?.disable();
          this.form?.get('deliveryFee')?.disable();
          this.form?.get('currencyId')?.disable();
          this.onStoreChange(this.authService.getStoreId() ?? 0);
        }
        // this.cateogryOptions = responses.categories.data;
        // this.warehouseOptions = responses.warehouses.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      // Cliente
      clientFirstName: ['', Validators.required],
      clientLastName: ['', Validators.required],
      clientEmail: ['', [Validators.email]],
      // clientExternalId: [''],

      // Dirección
      clientAddress: ['', Validators.required],
      clientAddressComplement: ['', Validators.required],
      cityId: [1, Validators.required],
      latitude: [''],
      longitude: [''],
      postalCode: [''],

      // Orden
      storeId: [
        this.authService.hasRole('tienda') ? this.authService.getStoreId() : '',
        Validators.required,
      ],
      deliveryFee: [150, [Validators.required, Validators.min(0)]],
      currencyId: [1, Validators.required],
      code: [''],
      contains: [''],
      // totalAmount: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
      // externalId: [''],

      // Productos
      orderItems: this.fb.array([]),
    });
  }

  get orderItems(): FormArray<FormGroup> {
    return this.form.get('orderItems') as FormArray<FormGroup>;
  }

  addItem(): void {
    const item = this.fb.group({
      productVariantId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    // Escuchar cambios en la variante seleccionada para actualizar el validador de cantidad
    item.get('productVariantId')?.valueChanges.subscribe((variantId) => {
      const variant = this.productVariants.find((v) => v.id === variantId);
      const quantityControl = item.get('quantity');
      if (variant) {
        quantityControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(variant.quantity),
        ]);
      } else {
        quantityControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
      }
      quantityControl?.updateValueAndValidity();
    });
    this.orderItems.push(item);
  }

  removeItem(index: number): void {
    this.orderItems.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.isLoading = true;
    this.orderService.create(payload).subscribe({
      next: (res) => {
        console.log('Orden creada:', res);
        this.messageService.showSuccess('Orden creada correctamente');
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  getOrderItemFormGroup(index: number): FormGroup {
    return this.orderItems.at(index) as FormGroup;
  }

  getVariantMaxQuantity(item: FormGroup): number | string {
    const variantId = item.get('productVariantId')?.value;
    const variant = this.productVariants.find((v) => v.id === variantId);
    return variant && typeof variant.quantity === 'number'
      ? variant.quantity
      : '-';
  }

  onStoreChange(storeId: number) {
    this.isLoading = true;
    this.warehouseInventoryService
      .getWarehouseInventories({ storeId: storeId, isAll: true })
      .subscribe({
        next: (res) => {
          this.productVariants = res.data.flatMap((product) =>
            (product.variants || []).map((variant) => ({
              ...variant,
              displayName: `${product.name} - ${variant.name}`,
            }))
          );
          // Limpiar productos seleccionados
          this.orderItems.clear();
          this.isLoading = false;
        },
        error: () => {
          this.productVariants = [];
          this.orderItems.clear();
          this.isLoading = false;
        },
      });
  }
}
