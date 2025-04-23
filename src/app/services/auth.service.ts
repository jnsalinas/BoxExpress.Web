import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'auth');
  }

  login(credentials: any): Observable<any> {
    const url = `${environment.apiUrl.replace(/\/+$/, '')}/${environment.auth.replace(/^\/+/, '')}`;
    return this.http
      .post<ApiResponse<any>>(url, credentials)
      .pipe(this.handleResponse());
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
