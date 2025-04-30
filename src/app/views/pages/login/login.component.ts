import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
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
import {FormsModule} from "@angular/forms";
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
    FormsModule
  ],
  providers:[{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private messageService: MessageService
              ) {}


  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingrese usuario y contraseña.';
      this.messageService.showError('login.emptyFields');
      return;
    }

    this.isLoading = true;
    const credentials = { username: this.username, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if(response) {
          this.authService.saveToken(response.token);
          this.messageService.showSuccess('login');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error en el servidor de autenticación.';
        this.messageService.showError('login.authError');
      }
    });
  }

  register(): void{
    this.router.navigate(['/register'])
  }
}
