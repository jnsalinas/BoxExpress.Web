import { Injectable } from '@angular/core';
import { OrderDto } from '../models/order.dto';
import { OrderFilter } from '../models/order-filter.model';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseApiService<OrderDto, OrderFilter> {
  constructor(http: HttpClient) {
    super(http, 'orders');
  }

  addInventory(orderId: number, inventoryData: any): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/Orders/${orderId}/inventory`,
        inventoryData
      )
      .pipe(
        this.handleResponse()
      );
  }
}
