import { Injectable } from '@angular/core';
import { ProductVariantDto } from '../models/product-variant.dto';
import { ProductVariantAutocompleteDto } from '../models/product-variant-autocomplete.dto';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WarehouseInventoryFilter } from '../models/warehouse-inventory-filter.model';
import { ProductDto } from '../models/product.dto';
import { PaginationDto } from '../models/common/pagination.dto';

@Injectable({ providedIn: 'root' })
export class WarehouseInventoryService extends BaseApiService<
  ProductVariantDto,
  WarehouseInventoryFilter
> {
  constructor(http: HttpClient) {
    super(http, 'warehouseinventories');
  }

  autocomplete(
    query: string,
    warehouseOriginId: number
  ): Observable<ProductVariantAutocompleteDto[]> {
    return this.http
      .get<ApiResponse<ProductVariantAutocompleteDto[]>>(
        `${environment.apiUrl}/warehouseinventories/autocomplete?query=${query}&warehouseOriginId=${warehouseOriginId}`
      )
      .pipe(this.handleResponse());
  }

  getWarehouseInventories(
    filter: WarehouseInventoryFilter
  ): Observable<{ data: ProductDto[]; pagination: PaginationDto }> {
    return this.http
      .post<ApiResponse<ProductDto[]>>(
        `${environment.apiUrl}/warehouseinventories/search`,
        filter
      )
      .pipe(this.handleResponseWithPagination<ProductDto[]>());
  }
}
