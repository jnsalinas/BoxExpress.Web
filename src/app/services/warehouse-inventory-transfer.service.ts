import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { WarehouseInventoryTransferFilter } from '../models/warehouse-inventory-transfer-filter.model';
import { WarehouseInventoryTransferDto } from '../models/warehouse-inventory-transfer.dto';

@Injectable({ providedIn: 'root' })
export class WarehouseInventoryTransferService extends BaseApiService<
WarehouseInventoryTransferDto,
WarehouseInventoryTransferFilter
> {
  constructor(http: HttpClient) {
    super(http, 'WarehouseInventoryTransfers');
  }
}
