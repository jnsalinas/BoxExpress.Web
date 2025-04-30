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
  ButtonDirective
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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  icons ={cilMobile, cilHome, cilLocationPin, cilFactory, cilCart};
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  registerForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      countryId: [null, Validators.required],
      cityId: [null, Validators.required],
      pickupAddress: ['', Validators.required],
      companyName: ['', Validators.required],
      legalName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      storeName: ['', Validators.required],
      balance: [0, Validators.required],
      password: ['', Validators.required],
    })
  }



  register(): void {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      this.messageService.showError("El formulario no tiene los datos completos", "Error")
      return;
    }
    const data =  this.registerForm.value;
    this.registerService.register(data).subscribe({
      next  : ()=> {
        this.messageService.showSuccess("hola","bien registrado")
      },
      error: (error) => {
        this.messageService.showError("error al realizar el registro: ", error)
      }
    })
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

}
