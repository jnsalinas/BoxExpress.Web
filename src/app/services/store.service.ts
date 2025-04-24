import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { StoreDto } from '../models/store.dto';
import { StoreFilter } from '../models/store-filter.model';

@Injectable({ providedIn: 'root' })
export class StoreService extends BaseApiService<
  StoreDto,
  StoreFilter
> {
  constructor(http: HttpClient) {
    super(http, 'stores');
  }
}
