import { Injectable } from '@angular/core';
import { WarehouseDto } from '../models/warehouse.dto';
import {  CreateWarehouseDto } from '../models/create-warehouse.dto';
import { WarehouseFilter } from '../models/warehouse-filter.model';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseApiService<
  WarehouseDto,
  WarehouseFilter
> {
  constructor(http: HttpClient) {
    super(http, 'warehouses');
  }

  createWarehouse(warehouseData: CreateWarehouseDto): Observable<WarehouseDto> {
    return this.http
      .post<ApiResponse<WarehouseDto>>(
        `${environment.apiUrl}/warehouses/create`,
        warehouseData
      )
      .pipe(this.handleResponse());
  }

  addInventory(warehouseId: number, inventoryData: any): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/Warehouses/${warehouseId}/inventory`,
        inventoryData
      )
      .pipe(this.handleResponse());
  }

  transfer(warehouseId: number, transferData: any): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/Warehouses/${warehouseId}/transfers`,
        transferData
      )
      .pipe(this.handleResponse());
  }

  transferStore(warehouseId: number, transferData: any): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/Warehouses/${warehouseId}/transferstore`,
        transferData
      )
      .pipe(this.handleResponse());
  }
}
