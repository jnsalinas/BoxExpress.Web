import { Component } from '@angular/core';
import {IconDirective} from '@coreui/icons-angular';
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
  ButtonDirective, CardHeaderComponent
}
  from '@coreui/angular';

import {cilMobile, cilHome, cilLocationPin, cilFactory, cilCart} from "@coreui/icons";
import {MessageService} from "../../../services/message.service";
import {Router} from "@angular/router";
import {RegisterService} from "../../../services/register.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {AuthInterceptor} from "../../../services/http-interceptors/auth.interceptor";
import {AuthService} from "../../../services/auth.service";
import {CommonModule} from "@angular/common";
import {environment} from "../../../../environments/environment";
import {CitiesService} from "../../../services/city.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule, CommonModule, CardHeaderComponent]
})
export class RegisterComponent {
  icons ={cilMobile, cilHome, cilLocationPin, cilFactory, cilCart};
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  registerForm: FormGroup;
  cities: any[]=[];
  loadCity: boolean = false;
  private passwordPattern = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+=\-{}[\]:;"'<>?,./]{8,}$/;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private citiesService: CitiesService,

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
      password: ['',[
        Validators.pattern(this.passwordPattern),
        Validators.required]],
    })
  }



  register(): void {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      this.messageService.showError("El formulario no tiene los datos completos", "Error")
      return;
    }
    const data =  this.registerForm.value;
    const storeData = {
      ...data,
      cityId: environment.defaultValues.cityId,
      countryId: environment.defaultValues.countryId,
      balance: environment.defaultValues.balance,
      pickupAdress:environment.defaultValues.pickupAddress
    }

    console.log('este es el store data: ', storeData)
    this.registerService.register(storeData).subscribe({
      next  : ()=> {
        this.messageService.showSuccess("hola","bien registrado")
        this.router.navigate(['/dashboard']);
        },
      error: (error) => {
        this.messageService.showError("error al realizar el registro: ", error)
      }
    })
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  loadCities(): void {
    this.citiesService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        this.messageService.showWarning("No se pudieron cargar las ciudades");
      }
    });
  }
}
