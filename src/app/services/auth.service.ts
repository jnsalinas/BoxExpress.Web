import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'auth');
  }
//https://run.mocky.io/v3/25e8c765-ac80-4e95-86fc-37ce20858cc2  https://run.mocky.io/v3/98a8b392-5d96-4af0-9234-d785d9a69222
  login(credentials: any): Observable<any> {
    return this.http
      .post<ApiResponse<any>>('https://run.mocky.io/v3/98a8b392-5d96-4af0-9234-d785d9a69222', credentials)
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
