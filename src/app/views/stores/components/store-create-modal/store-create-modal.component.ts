import {
  Component,
  EventEmitter,
  Input,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  ModalComponent,
  RowComponent,
  ColComponent,
} from '@coreui/angular';
import { ModalHeaderComponent } from '@coreui/angular';
import { ModalBodyComponent } from '@coreui/angular';
import { ModalFooterComponent } from '@coreui/angular';
import { ModalService } from '@coreui/angular';
import { StoreDto } from '../../../../models/store.dto';
import { StoreService } from '../../../../services/store.service';

@Component({
  selector: 'app-store-create-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  standalone: true,
  providers: [ModalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './store-create-modal.component.html',
  styleUrls: ['./store-create-modal.component.scss'],
})
export class StoreCreateModalComponent implements OnInit {
  @Input() storeId!: number;
  @Output() formSubmit = new EventEmitter<StoreDto>();
  @Output() onCloseModal = new EventEmitter<void>();
  store?: StoreDto;
  form!: FormGroup;
  isLoading = false;
  submitted = false;
  showPassword = false;
  constructor(private storeService: StoreService) {}

  initForm() {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      shopifyShopDomain: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getStore();
  }

  getStore() {
    this.storeService.getById(this.storeId).subscribe((store) => {
      this.store = store;
      this.form.patchValue(this.store);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose() {
    this.form.reset();
    this.onCloseModal.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
