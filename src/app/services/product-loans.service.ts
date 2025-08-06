import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProductLoansDto } from '../models/product-loan.dto';
import { ProductLoansFilter } from '../models/product-loan-filter.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common/api-response';
import { environment } from '../../environments/environment';
import { ProductLoanDetailDto } from '../models/product-loan-detail.dto';
import { ProductLoanStatus } from '../models/enums/product-loan-status.enum';

@Injectable({ providedIn: 'root' })
export class ProductLoansService extends BaseApiService<
  ProductLoansDto,
  ProductLoansFilter
> {
  constructor(http: HttpClient) {
    super(http, 'productloans');
  }

  // Obtener detalle completo de un préstamo
  getLoanDetail(id: number): Observable<ProductLoansDto> {
    return this.http
      .get<ApiResponse<ProductLoansDto>>(
        `${environment.apiUrl}/productloans/${id}/detail`
      )
      .pipe(this.handleResponse());
  }

  // Actualizar estado del préstamo
  updateStatus(id: number, status: ProductLoanStatus): Observable<void> {
    return this.http
      .put<ApiResponse<null>>(
        `${environment.apiUrl}/productloans/${id}/status`,
        { status }
      )
      .pipe(this.handleResponse());
  }

  // Actualizar cantidades de un detalle específico
  updateDetailQuantities(
    loanId: number, 
    detailId: number, 
    deliveredQuantity: number, 
    returnedQuantity: number
  ): Observable<ProductLoanDetailDto> {
    return this.http
      .put<ApiResponse<ProductLoanDetailDto>>(
        `${environment.apiUrl}/productloans/${loanId}/details/${detailId}/quantities`,
        { deliveredQuantity, returnedQuantity }
      )
      .pipe(this.handleResponse());
  }

  // Finalizar préstamo (marcar como completado)
  completeLoan(id: number): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/productloans/${id}/complete`,
        {}
      )
      .pipe(this.handleResponse());
  }

  // Obtener resumen de estados
  getStatusSummary(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(
        `${environment.apiUrl}/productloans/status-summary`
      )
      .pipe(this.handleResponse());
  }
}
