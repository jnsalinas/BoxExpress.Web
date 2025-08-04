import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { StoreBalanceListComponent } from 'src/app/views/stores/list/store-balance-list/store-balance-list.component';
import { StoreService } from 'src/app/services/store.service';
import { StoreDto } from 'src/app/models/store.dto';
import { HasRoleDirective } from 'src/app/shared/directives/has-role.directive';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bulk-upload-modal',
  imports: [
    CommonModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent, 
    ReactiveFormsModule,
    ModalFooterComponent,
    NgSelectModule,
    HasRoleDirective
  ],
  templateUrl: './bulk-upload-modal.component.html',
  styleUrl: './bulk-upload-modal.component.scss'
})
export class BulkUploadModalComponent {
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  isLoading = false;
  form!: FormGroup;
  stores: StoreDto[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private storeService: StoreService, private authService: AuthService) {
    if(this.authService.hasAnyRole(['admin'])) {
      this.loadStores();
    }
  }

  loadStores() {
    this.isLoading = true;
    this.storeService.getAll().subscribe((result) => {
      this.stores = result.data
      this.isLoading = false;
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
      this.isLoading = true;
      const payload = {
        ...this.form.value,
        file: this.selectedFile
      };
      this.onSave.emit(payload);
      this.isLoading = false;
    } else {
      console.error('Formulario inválido o archivo no seleccionado');
    }
  }

  close() {
    this.onClose.emit();
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      storeId: [this.authService.hasAnyRole(['admin']) ? null : this.authService.getStoreId(), Validators.required],
    });
  }
}
