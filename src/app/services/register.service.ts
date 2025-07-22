import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDto } from '../models/auth-dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseApiService<AuthDto, AuthDto> {

  constructor(http: HttpClient) {
    super(http, 'Stores');
  }

  register(storeData: any): Observable<AuthDto>{
    return this.create(storeData, 'create');
  }
}
