import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { WalletTransactionDto } from '../models/wallet-transaction.dto';
import { WalletTransactionFilter } from '../models/wallet-transaction-filter.model';

@Injectable({ providedIn: 'root' })
export class WalletTransactionService extends BaseApiService<WalletTransactionDto, WalletTransactionFilter> {
  constructor(http: HttpClient) {
    super(http, 'wallettransactions');
  }
}
