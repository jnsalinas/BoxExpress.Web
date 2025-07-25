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
import { StoreService } from '../../../../services/store.service';
import { StoreDto } from '../../../../models/store.dto';
import { NgSelectModule } from '@ng-select/ng-select';

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
    NgSelectModule,
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
  stores: StoreDto[] = [];
  isSaving = false;

  constructor(private fb: FormBuilder, private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadStores();
    // Inicializar el FormGroup con un FormArray de productos
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()]), // Inicializar con un producto
    });

    // Configurar listeners para cambios en SKU del producto
    this.setupSkuListeners();
  }

  loadStores() {
    this.storeService.getAll({ isAll: true }).subscribe((response) => {
      this.stores = response.data;
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

  resetForm() {
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()]),
    });
  }

  // Crear un nuevo FormGroup para un producto
  createProduct(product?: ProductDto): FormGroup {
    return this.fb.group({
      id: [product?.id || 0],
      name: [product?.name || '', Validators.required],
      price: [product?.price || null],
      variants: this.fb.array([this.createVariant()], [minLengthArray(1)]),
    });
  }

  initializeFormWithProducts(product: ProductDto) {
    const productGroup = this.fb.group({
      id: [product.id || 0],
      name: [product.name || '', Validators.required],
      sku: [product.sku || ''],
      variants: this.fb.array([this.createVariant()], [minLengthArray(1)]),
    });

    this.productForm = this.fb.group({
      products: this.fb.array([productGroup]),
    });

    // Configurar listeners después de crear el formulario
    this.setupSkuListeners();
  }

  // Crear un nuevo FormGroup para una variante
  createVariant(): FormGroup {
    return this.fb.group({
      id: [0],
      storeId: [null],
      name: ['', Validators.required],
      productCode: [''],
      sku: [''],
      shopifyId: [''],
      price: [null],
      quantity: [null, [Validators.required, Validators.min(0)]],
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
    // Configurar listeners para el nuevo producto
    // this.setupSkuListeners();
  }

  // Eliminar un producto del FormArray
  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  // Agregar una variante a un producto
  addVariant(productIndex: number): void {
    const productsArray = this.productForm.get('products') as FormArray;
    const productGroup = productsArray.at(productIndex);
    const variantsArray = productGroup.get('variants') as FormArray;
    variantsArray.push(this.createVariant());

    // this.addVariantWithAutoSku(productIndex);
  }

  // Eliminar una variante de un producto
  removeVariant(productIndex: number, variantIndex: number): void {
    const variants = this.getVariants(productIndex);
    variants.removeAt(variantIndex);
  }

  // Método para guardar los datos
  save() {
    if (this.productForm.valid) {
      this.isSaving = true;
      this.onSave.emit(this.productForm.value);
    } else {
      console.log('Formulario inválido:', this.productForm.value);
    }
  }

  // Método para resetear el estado de guardado
  resetSavingState() {
    this.isSaving = false;
  }

  // Método para cerrar el modal
  close() {
    this.onClose.emit();
  }

  // Función para generar SKU de variante
  generateVariantSku(productSku: string, variantIndex: number): string {
    if (!productSku) return '';
    return `${productSku}-${variantIndex + 1}`;
  }

  // Función para actualizar SKUs de todas las variantes
  updateVariantSkus() {
    const productsArray = this.productForm.get('products') as FormArray;

    productsArray.controls.forEach((productGroup, productIndex) => {
      const productSku = productGroup.get('sku')?.value || '';
      const variantsArray = productGroup.get('variants') as FormArray;

      variantsArray.controls.forEach((variantGroup, variantIndex) => {
        const generatedSku = this.generateVariantSku(productSku, variantIndex);
        variantGroup.patchValue({ sku: generatedSku });
      });
    });
  }

  // Configurar listeners para cambios en SKU del producto
  setupSkuListeners() {
    const productsArray = this.productForm.get('products') as FormArray;

    // Limpiar listeners anteriores para evitar duplicados
    productsArray.controls.forEach((productGroup, productIndex) => {
      const skuControl = productGroup.get('sku');
      if (skuControl) {
        // Desuscribirse de listeners anteriores si existen
        skuControl.valueChanges.subscribe((newSku) => {
          this.updateVariantSkus();
        });
      }
    });
  }

  // Función para agregar nueva variante con SKU automático
  addVariantWithAutoSku(productIndex: number) {
    const productsArray = this.productForm.get('products') as FormArray;
    const productGroup = productsArray.at(productIndex);
    const variantsArray = productGroup.get('variants') as FormArray;
    const productSku = productGroup.get('sku')?.value || '';

    const newVariant = this.fb.group({
      id: [0],
      storeId: [null],
      name: ['', Validators.required],
      productCode: [''],
      sku: [this.generateVariantSku(productSku, variantsArray.length)],
      shopifyId: [''],
      price: [null],
      quantity: [null, [Validators.required, Validators.min(1)]],
    });

    variantsArray.push(newVariant);
  }
}
