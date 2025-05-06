import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { WithdrawalRequestDto } from '../models/withdrawal-request.dto';
import { WithdrawalRequestRejectDto } from '../models/withdrawal-request-reject.dto';
import { WithdrawalRequestApproveDto } from '../models/withdrawal-request-approve.dto';
import { WithdrawalRequestFilter } from '../models/withdrawal-request-filter.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WithdrawalRequestService extends BaseApiService<
  WithdrawalRequestDto,
  WithdrawalRequestFilter
> {
  constructor(http: HttpClient) {
    super(http, 'withdrawalrequest');
  }

  approve(
    withdrawalRequestId: number,
    withdrawalRequestApproveDto: WithdrawalRequestApproveDto
  ): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${environment.apiUrl}/withdrawalrequest/${withdrawalRequestId}/approve`,
        withdrawalRequestApproveDto
      )
      .pipe(this.handleResponse());
  }

  reject(
    withdrawalRequestId: number,
    withdrawalRequest: WithdrawalRequestRejectDto
  ): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${environment.apiUrl}/withdrawalrequest/${withdrawalRequestId}/reject`,
        withdrawalRequest
      )
      .pipe(this.handleResponse());
  }
}
