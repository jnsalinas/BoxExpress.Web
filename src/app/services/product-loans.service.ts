import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProductLoansDto } from '../models/product-loan.dto';
import { ProductLoansFilter } from '../models/product-loan-filter.model';

@Injectable({ providedIn: 'root' })
export class ProductLoansService extends BaseApiService<
  ProductLoansDto,
  ProductLoansFilter
> {
  constructor(http: HttpClient) {
    super(http, 'productloans');
  }
}
