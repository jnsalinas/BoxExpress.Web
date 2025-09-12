import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
import { ProductVariantService } from '../../../../services/product-variant.service';
import { ProductVariantDto } from '../../../../models/product-variant.dto';
import { AuthService } from '../../../../services/auth.service';
import { OrderService } from '../../../../services/order.service';
import { MessageService } from '../../../../services/message.service';
import { CreateOrderDto } from '../../../../models/create-order.dto';
import { OrderDto } from '../../../../models/order.dto';
import { OrderItemDto } from '../../../../models/order-item.dto';

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
export class OrderFormComponent implements OnInit, OnChanges {
  @Input() orderToEdit?: CreateOrderDto;
  @Input() isEditMode: boolean = false;
  @Output() formSubmit = new EventEmitter<CreateOrderDto>();

  isLoading: boolean = false;
  form!: FormGroup;
  formReady = false;
  pendingOrderData?: CreateOrderDto;
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
    private productVariantService: ProductVariantService,
    public authService: AuthService,
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.buildForm();
    this.formReady = true;

    // Si hay datos pendientes, poblar ahora
    if (this.pendingOrderData) {
      this.populateFormWithOrder(this.pendingOrderData);
      this.pendingOrderData = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando orderToEdit cambia
    if (changes['orderToEdit'] && changes['orderToEdit'].currentValue) {
      if (this.formReady) {
        this.populateFormWithOrder(changes['orderToEdit'].currentValue);
      } else {
        // Guardar para poblar cuando el form esté listo
        this.pendingOrderData = changes['orderToEdit'].currentValue;
      }
    }
  }

  private populateFormWithOrder(order: CreateOrderDto): void {
    // Verificar que el formulario esté construido
    if (!this.form || !this.formReady) {
      this.pendingOrderData = order;
      return;
    }

    // Poblar datos básicos del formulario
    this.form.patchValue({
      clientFirstName: order.clientFirstName || '',
      clientLastName: order.clientLastName || '',
      clientEmail: order.clientEmail || '',
      clientPhone: order.clientPhone || '',
      clientAddress: order.clientAddress || '',
      clientAddressComplement: order.clientAddressComplement || '',
      cityId: order.cityId || null,
      latitude: order.latitude || null,
      longitude: order.longitude || null,
      postalCode: order.postalCode || null,
      storeId: order.storeId || null,
      deliveryFee: order.deliveryFee || 0,
      currencyId: order.currencyId || 1,
      code: order.code || '',
      contains: order.contains || '',
      totalAmount: order.totalAmount || 0,
      notes: order.notes || '',
    });

    // Si hay storeId, cargar productos primero
    if (order.storeId) {
      this.onStoreChange(order.storeId);

      // Esperar a que los productos se carguen antes de poblar los items
      setTimeout(() => {
        this.populateOrderItems(order.orderItems || []);
      }, 1500); // Dar más tiempo para que se carguen los productos
    } else {
      // Si no hay storeId, poblar items directamente
      this.populateOrderItems(order.orderItems || []);
    }
  }

  private populateOrderItems(items: OrderItemDto[]): void {
    if (items && items.length > 0) {
      this.orderItems.clear();
      items.forEach((item) => {
        this.addItemWithData(item);
      });

      // Validar todos los items después de poblar
      setTimeout(() => {
        this.orderItems.controls.forEach((itemGroup: FormGroup) => {
          const quantityControl = itemGroup.get('quantity');
          const variantId = itemGroup.get('productVariantId')?.value;
          const variant = this.productVariants.find((v) => v.id === variantId);

          if (variant && quantityControl) {
            const currentQuantity = quantityControl.value;
            if (currentQuantity > variant.quantity) {
              quantityControl.markAsTouched();
              quantityControl.updateValueAndValidity();
            }
          }
        });
      }, 500);
    }
  }

  private addItemWithData(item: OrderItemDto): void {
    const itemGroup = this.fb.group({
      productVariantId: [item.productVariantId || null, Validators.required],
      quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
    });

    // Configurar validadores después de que se carguen los productos
    const setupValidators = () => {
      const variant = this.productVariants.find(
        (v) => v.id === item.productVariantId
      );
      if (variant) {
        const quantityControl = itemGroup.get('quantity');
        const currentQuantity = quantityControl?.value || 1;

        quantityControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(variant.quantity),
        ]);
        quantityControl?.updateValueAndValidity();

        // Si la cantidad actual es mayor al stock, marcar como touched para mostrar error
        if (currentQuantity > variant.quantity) {
          quantityControl?.markAsTouched();
        }
      }
    };

    // Si los productos ya están cargados, configurar validadores inmediatamente
    if (this.productVariants.length > 0) {
      setupValidators();
    } else {
      // Si no están cargados, esperar a que se carguen
      const checkInterval = setInterval(() => {
        if (this.productVariants.length > 0) {
          setupValidators();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    this.orderItems.push(itemGroup);
  }

  getData() {
    this.isLoading = true;

    forkJoin({
      cities: this.cityService.getAll({}),
      stores: this.storeService.getAll({ isAll: true }),
      statuses: this.orderStatusService.getAll(),
      currencies: this.currencyService.getAll(),
    }).subscribe({
      next: (responses) => {
        this.cities = responses.cities.data;
        this.stores = responses.stores.data;
        this.statuses = responses.statuses.data;
        this.currencies = responses.currencies.data;
        if (this.authService.hasRole('tienda')) {
          this.form?.get('storeId')?.disable();
          this.form?.get('deliveryFee')?.disable();
          this.form?.get('currencyId')?.disable();
          this.onStoreChange(this.authService.getStoreId() ?? 0);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      clientFirstName: ['', [Validators.required, Validators.minLength(2)]],
      clientLastName: ['', [Validators.required, Validators.minLength(2)]],
      clientEmail: ['', [Validators.email]],
      clientPhone: ['', [Validators.required, Validators.minLength(5)]],
      clientAddress: ['', [Validators.required, Validators.minLength(5)]],
      clientAddressComplement: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      cityId: [null, Validators.required],
      latitude: [null],
      longitude: [null],
      postalCode: [null],

      storeId: [
        this.authService.hasRole('tienda') ? this.authService.getStoreId() : '',
        Validators.required,
      ],
      deliveryFee: [150, [Validators.required, Validators.min(0)]],
      currencyId: [1, Validators.required],
      code: [''],
      totalAmount: [null, [Validators.required, Validators.min(0.01)]],
      notes: [''],

      orderItems: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
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

      // Marcar como touched para mostrar errores inmediatamente
      quantityControl?.markAsTouched();
    });

    this.orderItems.push(item);

    setTimeout(() => {
      const newItem = this.orderItems.at(
        this.orderItems.length - 1
      ) as FormGroup;
      newItem.markAsPristine();
      newItem.markAsUntouched();
    });
  }

  removeItem(index: number): void {
    this.orderItems.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.orderItems.controls.forEach((item: FormGroup) => {
        Object.keys(item.controls).forEach((key) => {
          const control = item.get(key);
          control?.markAsTouched();
        });
      });

      this.messageService.showMessageError("Por favor, complete todos los campos requeridos.");
      return;

    }
    const payload = this.form.getRawValue();

    const createOrder: CreateOrderDto = {
      clientFirstName: payload.clientFirstName,
      clientLastName: payload.clientLastName,
      clientEmail: payload.clientEmail,
      clientPhone: payload.clientPhone.toString(),
      clientAddress: payload.clientAddress,
      clientAddressComplement: payload.clientAddressComplement,
      cityId: payload.cityId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      postalCode: payload.postalCode,
      storeId: payload.storeId,
      deliveryFee: payload.deliveryFee,
      currencyId: payload.currencyId,
      code: payload.code,
      totalAmount: payload.totalAmount,
      notes: payload.notes,
      orderItems: payload.orderItems,
    };

    // Emitir el evento con los datos del formulario
    this.formSubmit.emit(createOrder);
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
    if (storeId > 0) {
      let deliveryFee = this.stores.find((s) => s.id === storeId)?.deliveryFee ?? 150;
      this.form.get('deliveryFee')?.setValue(deliveryFee);
      this.isLoading = true;
      this.productVariantService
        .getAll({ storeId: storeId, isAll: true })
        .subscribe({
          next: (res) => {
            this.productVariants = res.data.map((pv) => ({
              ...pv,
              displayName: `${pv.productName} - ${pv.name} - ${pv.sku}`,
            }));
            // Solo limpiar items si no estamos en modo edición
            if (!this.isEditMode) {
              this.orderItems.clear();
            }
            this.isLoading = false;
          },
          error: () => {
            this.productVariants = [];
            if (!this.isEditMode) {
              this.orderItems.clear();
            }
            this.isLoading = false;
          },
        });
    } else {
      this.productVariants = [];
      if (!this.isEditMode) {
        this.orderItems.clear();
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min'])
        return `El valor mínimo es ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `El valor máximo es ${field.errors['max'].max}`;
    }
    return '';
  }

  isFormArrayInvalid(arrayName: string): boolean {
    const array = this.form.get(arrayName) as FormArray;
    if (!array) return false;

    // Verificar si el array tiene errores propios
    if (array.invalid && array.touched) return true;

    // Verificar si algún item individual tiene errores
    if (array.controls.length > 0) {
      return array.controls.some((itemGroup) => {
        const quantityControl = (itemGroup as FormGroup).get('quantity');
        return quantityControl?.invalid && quantityControl?.touched;
      });
    }

    return false;
  }

  getFormArrayError(arrayName: string): string {
    const array = this.form.get(arrayName) as FormArray;
    if (array && array.errors) {
      if (array.errors['required']) return 'Debe agregar al menos un producto';
      if (array.errors['minlength']) return 'Debe agregar al menos un producto';
    }

    // Verificar errores en items individuales
    if (array && array.controls.length > 0) {
      const errors: string[] = [];

      array.controls.forEach((itemGroup, index: number) => {
        const quantityControl = (itemGroup as FormGroup).get('quantity');
        const variantControl = (itemGroup as FormGroup).get('productVariantId');

        if (quantityControl?.invalid && quantityControl?.touched) {
          if (quantityControl.errors?.['max']) {
            const variantId = variantControl?.value;
            const variant = this.productVariants.find(
              (v) => v.id === variantId
            );
            errors.push(
              `Producto ${index + 1}: La cantidad máxima es ${
                variant?.quantity || 'desconocida'
              }`
            );
          }
          if (quantityControl.errors?.['min']) {
            errors.push(
              `Producto ${index + 1}: La cantidad mínima es ${
                quantityControl.errors['min'].min
              }`
            );
          }
          if (quantityControl.errors?.['required']) {
            errors.push(`Producto ${index + 1}: La cantidad es requerida`);
          }
        }
      });

      if (errors.length > 0) {
        return errors.join('. ');
      }
    }

    return '';
  }

  isOrderItemFieldInvalid(itemIndex: number, fieldName: string): boolean {
    const item = this.orderItems.at(itemIndex) as FormGroup;
    const field = item.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getOrderItemFieldError(itemIndex: number, fieldName: string): string {
    const item = this.orderItems.at(itemIndex) as FormGroup;
    const field = item.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['min'])
        return `El valor mínimo es ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `El valor máximo es ${field.errors['max'].max}`;
    }
    return '';
  }
}
