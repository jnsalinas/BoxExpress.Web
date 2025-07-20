import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { WarehouseInventoryTransferFilter } from '../models/warehouse-inventory-transfer-filter.model';
import { WarehouseInventoryTransferDto } from '../models/warehouse-inventory-transfer.dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common/api-response';
import { environment } from 'src/environments/environment';
import { WithdrawalRequestRejectDto } from '../models/withdrawal-request-reject.dto';

@Injectable({ providedIn: 'root' })
export class WarehouseInventoryTransferService extends BaseApiService<
  WarehouseInventoryTransferDto,
  WarehouseInventoryTransferFilter
> {
  constructor(http: HttpClient) {
    super(http, 'WarehouseInventoryTransfers');
  }

  accept(WarehouseInventoryTransferId: number): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/warehouseinventorytransfers/${WarehouseInventoryTransferId}/accept`,
        {}
      )
      .pipe(this.handleResponse());
  }

  reject(
    WarehouseInventoryTransferId: number,
    reason: WithdrawalRequestRejectDto
  ): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/warehouseinventorytransfers/${WarehouseInventoryTransferId}/reject`,
        reason
      )
      .pipe(this.handleResponse());
  }

  getPendingTransfers(filter: any): Observable<number> {
    return this.http
      .post<ApiResponse<number>>(
        `${environment.apiUrl}/warehouseinventorytransfers/pending-transfers`,
        {}
      )
      .pipe(this.handleResponse());
  }
}
