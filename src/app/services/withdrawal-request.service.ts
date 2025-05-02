import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { WithdrawalRequestDto } from '../models/withdrawal-request.dto';
import { WithdrawalRequestFilter } from '../models/withdrawal-request-filter.model';

@Injectable({ providedIn: 'root' })
export class WithdrawalRequestService extends BaseApiService<
  WithdrawalRequestDto,
  WithdrawalRequestFilter
> {
  constructor(http: HttpClient) {
    super(http, 'withdrawalrequest');
  }
}
