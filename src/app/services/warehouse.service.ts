import { Injectable } from '@angular/core';
import { WarehouseDto } from '../models/warehouse.dto';
import { WarehouseFilter } from '../models/warehouse-filter.model';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseApiService<WarehouseDto, WarehouseFilter> {
  constructor(http: HttpClient) {
    super(http, 'warehouses');
  }
}
