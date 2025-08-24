import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ButtonDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  ColComponent,
} from '@coreui/angular';

import { WarehouseService } from '../../../../services/warehouse.service';
import { CityService } from '../../../../services/city.service';
import { CreateWarehouseDto } from '../../../../models/create-warehouse.dto';
import { CityDto } from '../../../../models/city.dto';
import { passwordPattern } from '../../../../shared/validators/custom-validators';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-warehouse-create-modal',
  templateUrl: './warehouse-create-modal.component.html',
  styleUrls: ['./warehouse-create-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    ColComponent,
    IconDirective,
    IconModule,
  ],
})
export class WarehouseCreateModalComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<CreateWarehouseDto>();

  form: FormGroup;
  cities: CityDto[] = [];
  isLoading = false;
  submitted = false;
  showPassword = false;
  icons = freeSet;
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private cityService: CityService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      cityId: [null, Validators.required],
      address: ['', Validators.required],
      manager: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordPattern]],
    });
  }

  ngOnInit() {
    this.loadCities();
    this.form.reset();
    this.submitted = false;
  }

  close() {
    this.onClose.emit();
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      const warehouseData: CreateWarehouseDto = this.form.value;
      
      // Emitir los datos al padre para que maneje la lógica
      this.onSave.emit(warehouseData);
      // El isLoading se reseteará desde el padre cuando complete la operación
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Método para resetear el loading desde el padre
  resetLoading() {
    this.isLoading = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private loadCities() {
    this.cityService.getAll().subscribe({
      next: (response) => {
        this.cities = response.data || [];
      },
      error: (error) => {
        console.error('Error cargando ciudades:', error);
      }
    });
  }
} 