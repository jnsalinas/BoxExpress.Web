import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { InventoryHoldDto } from '../models/inventory-hold.dto';
import { InventoryHoldFilter } from '../models/inventory-hold-filter.model';
import { InventoryHoldResolutionDto } from '../models/inventory-hold-resolution.dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryHoldService extends BaseApiService<
  InventoryHoldDto,
  InventoryHoldFilter
> {
  constructor(http: HttpClient) {
    super(http, 'InventoryHolds');
  }

  acceptReturn(
    inventoryHoldResolution: InventoryHoldResolutionDto
  ): Observable<ApiResponse<boolean>> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/InventoryHolds/acceptreturn`,
        inventoryHoldResolution
      )
      .pipe(this.handleResponse());
  }

  rejectReturn(
    inventoryHoldResolution: InventoryHoldResolutionDto
  ): Observable<ApiResponse<boolean>> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/InventoryHolds/rejectreturn`,
        inventoryHoldResolution
      )
      .pipe(this.handleResponse());
  }
}
