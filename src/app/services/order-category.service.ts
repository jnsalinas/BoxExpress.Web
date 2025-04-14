import { Injectable } from '@angular/core';
import { OrderCategoryDto } from '../models/order-category.dto';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/common/api-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderCategoryFilter } from '../models/order-category-filter';

@Injectable({ providedIn: 'root' })
export class OrderCategoryService extends BaseApiService<
  OrderCategoryDto,
  OrderCategoryFilter
> {
  constructor(http: HttpClient) {
    super(http, 'ordercategories');
  }
}
