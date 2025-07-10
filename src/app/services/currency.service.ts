import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CurrencyDto } from '../models/currency.dto';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService extends BaseApiService<CurrencyDto, any> {
  constructor(http: HttpClient) {
    super(http, 'Currency');
  }
}
