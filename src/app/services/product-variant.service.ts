import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProductVariantDto } from '../models/product-variant.dto';
import { ProductVariantFilter } from '../models/product-variant-filter.model';

@Injectable({ providedIn: 'root' })
export class ProductVariantService extends BaseApiService<
  ProductVariantDto,
  ProductVariantFilter
> {
  constructor(http: HttpClient) {
    super(http, 'productvariants');
  }
}
