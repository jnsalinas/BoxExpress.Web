import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseApiService<any, any> {

  constructor(http: HttpClient) {
    super(http, 'Stores');
  }

  register(storeData: any): Observable<any> {
    console.log('Registro con datos:', storeData);
    return this.create(storeData, 'create');
  }
}
