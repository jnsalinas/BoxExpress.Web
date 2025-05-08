import { Component } from '@angular/core';
import {CommonModule, NgStyle} from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective
} from '@coreui/angular';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from "../../../services/message.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../../../services/http-interceptors/auth.interceptor";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm: FormGroup

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private messageService: MessageService,
              ) {
    this.loginForm = this.fb.group({
      username: ['',[ Validators.required, Validators.email]],
      password: ['', Validators.required],
      /*password:[
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$'
          )

        ]],*/
    })
  }

  login(): void {

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.messageService.showError("El formulario no tiene los datos completos", "Error")
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;
    console.log('estas son las credenciales: ', credentials)

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if(response) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error en el servidor de autenticación.';
        this.messageService.showError('login.invalidCredentials');
      }
    });
  }

  register(): void{
    this.router.navigate(['/register'])
  }
}
