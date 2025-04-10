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
} from '@coreui/angular'; // Ajusta según cómo estés usando CoreUI

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
  ],
})
export class WarehouseProductModalComponent implements OnInit {
  @Input() warehouseId: number | null = null;
  @Input() warehouseName: string | null = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  productForm: FormGroup = this.fb.group({});;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializar el FormGroup con un FormArray de productos
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()]), // Inicializar con un producto
    });
  }

  // Crear un nuevo FormGroup para un producto
  createProduct(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Nombre del producto
      variants: this.fb.array([this.createVariant()]), // Inicializar con una variante
    });
  }

  // Crear un nuevo FormGroup para una variante
  createVariant(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Nombre de la variante
      productCode: [''],
      quantity: [0, [Validators.required, Validators.min(1)]], // Cantidad de la variante
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
