import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { freeSet } from '@coreui/icons';

import {
  ModalModule,
  ButtonModule,
  FormModule,
  CardModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
} from '@coreui/angular'; // Ajusta según cómo estés usando CoreUI
import { IconDirective } from '@coreui/icons-angular';
import { ProductDto } from '../../../../models/product.dto';
import { ProductVariantDto } from '../../../../models/product-variant.dto';
import { minLengthArray } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-warehouse-product-modal',
  standalone: true,
  templateUrl: './warehouse-product-modal.component.html',
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
export class WarehouseProductModalComponent implements OnInit {
  @Input() warehouseId: number | null = null;
  @Input() warehouseName: string | null = null;
  @Input() isVisible: boolean = false;
  @Input() productToEdit: ProductDto | null = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  icons = freeSet;

  productForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializar el FormGroup con un FormArray de productos
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()]), // Inicializar con un producto
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit']) {
      if (this.productToEdit) {
        this.initializeFormWithProducts(this.productToEdit);
      } else {
        this.resetForm();
      }
    }
  }

  initializeFormWithProducts(product: ProductDto) {
    const productGroup = this.fb.group({
      id: [product.id || 0],
      name: [product.name || '', Validators.required],
      sku: [product.sku || ''],
      shopifyId: [product.shopifyProductId || ''],
      price: [product.price || 0],
      variants: this.fb.array(
        (product.variants || []).map((v: ProductVariantDto) =>
          this.fb.group({
            id: [v.id || 0],
            name: [v.name || '', Validators.required],
            sku: [v.sku || ''],
            price: [v.price || 0],
            quantity: [
              v.quantity || 0,
              [Validators.required, Validators.min(1)],
            ],
          })
        )
      ),
    });

    this.productForm = this.fb.group({
      products: this.fb.array([productGroup]),
    });
  }

  resetForm() {
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()]),
    });
  }

  // Crear un nuevo FormGroup para un producto
  createProduct(): FormGroup {
    return this.fb.group({
      id: [0],
      name: ['', Validators.required], // Nombre del producto
      shopifyId: [''],
      sku: [''],
      price: [null],
      variants: this.fb.array([this.createVariant()], [minLengthArray(1)]),
    });
  }

  // Crear un nuevo FormGroup para una variante
  createVariant(): FormGroup {
    return this.fb.group({
      id: [0],
      name: ['', Validators.required], // Nombre de la variante
      productCode: [''],
      sku: [''],
      price: [null],
      quantity: [null, [Validators.required, Validators.min(1)]], // Cantidad de la variante
    });
  }

  // Obtener el FormArray de productos
  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  // Obtener el FormArray de variantes de un producto
  getVariants(productIndex: number): FormArray {
    return this.products.at(productIndex).get('variants') as FormArray;
  }

  // Agregar un producto al FormArray
  addProduct(): void {
    this.products.push(this.createProduct());
  }

  // Eliminar un producto del FormArray
  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  // Agregar una variante a un producto
  addVariant(productIndex: number): void {
    const variants = this.getVariants(productIndex);
    variants.push(this.createVariant());
  }

  // Eliminar una variante de un producto
  removeVariant(productIndex: number, variantIndex: number): void {
    const variants = this.getVariants(productIndex);
    variants.removeAt(variantIndex);
  }

  // Método para guardar los datos
  save() {
    if (this.productForm.valid) {
      this.onSave.emit(this.productForm.value);
    } else {
      console.log('Formulario inválido:', this.productForm.value);
    }
  }

  // Método para cerrar el modal
  close() {
    this.onClose.emit();
  }
}
