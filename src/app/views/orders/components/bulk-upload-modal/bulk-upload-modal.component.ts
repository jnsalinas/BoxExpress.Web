import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
} from '@coreui/angular';

import {
  FormBuilder,
  FormControlDirective,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreService } from '../../../../services/store.service';
import { StoreDto } from '../../../../models/store.dto';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { AuthService } from '../../../../services/auth.service';
import { BulkUploadDataDto } from '../../../../models/bulk-upload-response.dto';
import { BehaviorSubject } from 'rxjs';
import { CityService } from '../../../../services/city.service';
import { CityDto } from '../../../../models/city.dto';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-bulk-upload-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ReactiveFormsModule,
    ModalFooterComponent,
    NgSelectModule,
    HasRoleDirective,
    AsyncPipe,
    CommonModule,
    IconDirective,
    IconModule,
  ],
  templateUrl: './bulk-upload-modal.component.html',
  styleUrl: './bulk-upload-modal.component.scss',
})
export class BulkUploadModalComponent {
  @Output() onSave = new EventEmitter<any>();
  @Input() bulkUploadResults$!: BehaviorSubject<BulkUploadDataDto[]>;
  @Output() onClose = new EventEmitter<any>();

  isLoading = false;
  isSaving = false;
  form!: FormGroup;
  stores: StoreDto[] = [];
  selectedFile: File | null = null;
  cities: CityDto[] = [];
  icons = freeSet;
  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private authService: AuthService,
    private cityService: CityService
  ) {
    if (this.authService.hasRoleOrHigher('supervisor')) {
      this.loadStores();
      this.loadCities();
    }
  }

  loadStores() {
    this.isLoading = true;
    this.storeService.getAll().subscribe((result) => {
      this.stores = result.data;
      this.isLoading = false;
    });
  }

  loadCities() {
    this.cityService.getAll().subscribe((result) => {
      this.cities = result.data;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file);
    }
  }

  save() {
    if (this.form.valid && this.selectedFile) {
      this.isSaving = true;
      const payload = {
        ...this.form.value,
        file: this.selectedFile,
      };
      this.onSave.emit(payload);
    } else {
      console.error('Formulario inválido o archivo no seleccionado');
    }
  }

  close() {
    this.onClose.emit();
    this.isSaving = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      storeId: [
        this.authService.hasRoleOrHigher('supervisor')
          ? null
          : this.authService.getStoreId(),
        Validators.required,
      ],
    });
  }

  getSuccessfulCount(results: BulkUploadDataDto[]): number {
    return results.filter((r) => r.isLoaded).length;
  }

  getErrorCount(results: BulkUploadDataDto[]): number {
    return results.filter((r) => !r.isLoaded).length;
  }

  getTotalCount(results: BulkUploadDataDto[]): number {
    return results.length;
  }

  getShowResults(): boolean {
    return this.bulkUploadResults$ && this.bulkUploadResults$.value.length > 0;
  }

  getStatusText(result: any): string {
    if (result.isLoaded) {
      return 'Exitoso';
    } else if (result?.id > 0) {
      return 'Cargado con errores';
    } else {
      return 'No cargado';
    }
  }

  resetSavingState() {
    this.isSaving = false;
    this.resetForm();
  }

  resetForm() {
    debugger;
    this.form.reset();
    this.form.patchValue({
      file: null,
    });
    this.selectedFile = null;
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
