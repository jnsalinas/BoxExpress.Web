import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { InventoryHoldDto } from '../models/inventory-hold.dto';
import { InventoryHoldFilter } from '../models/inventory-hold-filter.model';

@Injectable({ providedIn: 'root' })
export class InventoryHoldService extends BaseApiService<
  InventoryHoldDto,
  InventoryHoldFilter
> {
  constructor(http: HttpClient) {
    super(http, 'InventoryHolds');
  }
}
