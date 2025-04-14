import { Injectable } from '@angular/core';
import { OrderStatusDto } from '../models/order-status.dto';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderStatusFilter } from '../models/order-status-filter';

@Injectable({ providedIn: 'root' })
export class OrderStatusService extends BaseApiService<
  OrderStatusDto,
  OrderStatusFilter
> {
  constructor(http: HttpClient) {
    super(http, 'Orderstatuses');
  }
}
