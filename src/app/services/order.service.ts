import { Injectable } from '@angular/core';
import { OrderDto } from '../models/order.dto';
import { OrderStatusHistoryDto } from '../models/order-status-history.dto';
import { OrderCategoryHistoryDto } from '../models/order-category-history.dto';
import { OrderFilter } from '../models/order-filter.model';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderScheduleUpdateDto } from '../models/order-schedule-update.dto';
import { OrderItemDto } from '../models/order-item.dto';
import { OrderSummaryDto } from '../models/order-summary.dto';
import { CreateOrderDto } from '../models/create-order.dto';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseApiService<OrderDto, OrderFilter> {
  constructor(http: HttpClient) {
    super(http, 'orders');
  }

  addInventory(orderId: number, inventoryData: any): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/inventory`,
        inventoryData
      )
      .pipe(this.handleResponse());
  }

  changeWarehouse(orderId: number, warehouseId: number): Observable<void> {
    return this.http
      .patch<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/warehouse/${warehouseId}`,
        {}
      )
      .pipe(this.handleResponse());
  }

  changeStatus(orderId: number, statusId: number): Observable<void> {
    return this.http
      .patch<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/status/${statusId}`,
        {}
      )
      .pipe(this.handleResponse());
  }

  schedule(
    orderId: number,
    orderScheduleUpdateDto: OrderScheduleUpdateDto
  ): Observable<OrderDto> {
    return this.http
      .patch<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/schedule`,
        orderScheduleUpdateDto
      )
      .pipe(this.handleResponse());
  }

  getOrderStatusHistory(orderId: number): Observable<OrderStatusHistoryDto[]> {
    return this.http
      .get<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/status-history`
      )
      .pipe(this.handleResponse());
  }

  getOrderCategoryHistory(
    orderId: number
  ): Observable<OrderCategoryHistoryDto[]> {
    return this.http
      .get<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/category-history`
      )
      .pipe(this.handleResponse());
  }

  getProducts(orderId: number): Observable<OrderItemDto[]> {
    return this.http
      .get<ApiResponse<null>>(
        `${environment.apiUrl}/orders/${orderId}/products`
      )
      .pipe(this.handleResponse());
  }

  getSummary(filter: OrderFilter): Observable<OrderSummaryDto[]> {
    return this.http
      .post<ApiResponse<null>>(`${environment.apiUrl}/orders/summary`, filter)
      .pipe(this.handleResponse());
  }

  createOrder(payload: CreateOrderDto): Observable<OrderDto> {
    return this.http
      .post<ApiResponse<null>>(`${environment.apiUrl}/orders`, payload)
      .pipe(this.handleResponse());
  }

  updateOrder(orderId: number, payload: CreateOrderDto): Observable<OrderDto> {
    return this.http
      .put<ApiResponse<OrderDto>>(`${environment.apiUrl}/orders/${orderId}`, payload)
      .pipe(this.handleResponse());
  }
}
