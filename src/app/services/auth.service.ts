import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthDto } from '../models/auth-dto';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'auth');
  }

  login(credentials: any): Observable<AuthDto> {
    const url = `${environment.apiUrl.replace(
      /\/+$/,
      ''
    )}/${environment.auth.replace(/^\/+/, '')}`;
    return this.http
      .post<ApiResponse<AuthDto>>(url, credentials)
      .pipe(this.handleResponse());
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoreId(): number | null {
    const storeId = localStorage.getItem('storeId');
    return storeId ? Number(storeId) : null;
  }

  saveAuth(auth: AuthDto): void {
    localStorage.setItem('auth_token', auth.token ?? '');
    localStorage.setItem('auth_role', auth.role?.toLowerCase() ?? '');
    if (auth.storeId) {
      localStorage.setItem('storeId', auth.storeId.toString());
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  }

  get role(): string | null {
    return localStorage.getItem('auth_role');
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.role || '');
  }
}
