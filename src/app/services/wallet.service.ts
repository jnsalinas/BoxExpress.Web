import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { StoreDto } from '../models/store.dto';
import { StoreFilter } from '../models/store-filter.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletService extends BaseApiService<StoreDto, StoreFilter> {
  constructor(http: HttpClient) {
    super(http, 'wallets');
  }

  summary(): Observable<StoreDto> {
    return this.http
      .get<ApiResponse<StoreDto>>(`${environment.apiUrl}/wallets/summary`)
      .pipe(this.handleResponse());
  }
}
