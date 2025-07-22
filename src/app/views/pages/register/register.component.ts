import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  CardHeaderComponent,
} from '@coreui/angular';

import {
  cilMobile,
  cilHome,
  cilLocationPin,
  cilFactory,
  cilCart,
} from '@coreui/icons';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { error } from '@angular/compiler-cli/src/transformers/util';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from '../../../services/http-interceptors/auth.interceptor';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CardHeaderComponent,
  ],
})
export class RegisterComponent {
  icons = { cilMobile, cilHome, cilLocationPin, cilFactory, cilCart };
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  registerForm: FormGroup;
  cities: any[] = [];
  loadCity: boolean = false;
  private passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+=\-{}[\]:;"'<>?,./]{8,}$/;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private messageService: MessageService,
    private cityService: CityService,
    private authService: AuthService
  ) {
    this.loadCities();
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      legalName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      storeName: ['', Validators.required],
      city: [{ value: 1, disabled: true }, Validators.required], // ← deshabilitado desde el inicio
      password: [
        '',
        [Validators.pattern(this.passwordPattern), Validators.required],
      ],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.messageService.showError(
        'El formulario no tiene los datos completos',
        'Error'
      );
      return;
    }
    this.isLoading = true;

    const data = this.registerForm.value;
    const storeData = {
      ...data,
      cityId: environment.defaultValues.cityId,
      countryId: environment.defaultValues.countryId,
      balance: environment.defaultValues.balance,
      pickupAdress: environment.defaultValues.pickupAddress,
    };

    this.registerService.register(storeData).subscribe({
      next: (response) => {
        this.messageService.showSuccess(
          'BoxExpress',
          'Bienvenido a la plataforma'
        );
        this.authService.saveAuth(response);
        if (this.authService.hasAnyRole(['tienda', 'admin'])) {
          this.router.navigate(['/orders']);
        } else {
          this.router.navigate(['/warehouses']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.showError('error al realizar el registro: ', error);
        this.isLoading = false;
      },
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  loadCities(): void {
    this.isLoading = true;
    this.cityService.getAll().subscribe({
      next: (cities) => {
        this.cities = cities.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showWarning('No se pudieron cargar las ciudades');
        this.isLoading = false;
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  isValid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.valid && (control.touched || control.dirty));
  }
}
