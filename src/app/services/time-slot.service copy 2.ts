import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { BankDto } from '../models/bank.dto';
import { BankFilter } from '../models/bank-filter.model';

@Injectable({ providedIn: 'root' })
export class BankService extends BaseApiService<
  BankDto,
  BankFilter
> {
  constructor(http: HttpClient) {
    super(http, 'Banks');
  }
}
