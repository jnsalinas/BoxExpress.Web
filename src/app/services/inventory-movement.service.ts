import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { InventoryMovementDto } from '../models/inventory-movement.dto';
import { InventoryMovementFilter } from '../models/inventory-movement-filter.model';

@Injectable({ providedIn: 'root' })
export class InventoryMovementService extends BaseApiService<
  InventoryMovementDto,
  InventoryMovementFilter
> {
  constructor(http: HttpClient) {
    super(http, 'InventoryMovements');
  }
}
