import { Injectable } from '@angular/core';
import { ProductVariantDto } from '../models/product-variant.dto';
import { ProductVariantAutocompleteDto } from '../models/product-variant-autocomplete.dto';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductVariantService extends BaseApiService<
  ProductVariantDto,
  any
> {
  constructor(http: HttpClient) {
    super(http, 'productvariants');
  }

  autocomplete(query: string, warehouseOriginId: number): Observable<ProductVariantAutocompleteDto[]> {
    return this.http
      .get<ApiResponse<ProductVariantAutocompleteDto[]>>(
        `${environment.apiUrl}/productvariants/autocomplete?query=${query}&warehouseOriginId=${warehouseOriginId}`
      )
      .pipe(this.handleResponse());
  }
}
