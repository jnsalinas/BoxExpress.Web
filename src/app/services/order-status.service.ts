import { Injectable } from '@angular/core';
import { OrderStatusDto } from '../models/order-status.dto';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { OrderStatusFilter } from '../models/order-status-filter.model';

@Injectable({ providedIn: 'root' })
export class OrderStatusService extends BaseApiService<
  OrderStatusDto,
  OrderStatusFilter
> {
  constructor(http: HttpClient) {
    super(http, 'Orderstatuses');
  }
}
