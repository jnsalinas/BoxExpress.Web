import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionDto } from '../../../models/wallet-transaction.dto';
import { WalletTransactionService } from '../../../services/wallet-transaction.service';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';
import { UtcDatePipe } from '../../../shared/pipes/utc-date.pipe'; // Adjust the path as needed
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../shared/utils/date-utils';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { PaginationDto } from '../../../models/common/pagination.dto';

@Component({
  selector: 'app-wallet-transaction-list',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ReactiveFormsModule,
    CommonModule,
    UtcDatePipe,
    GenericPaginationComponent,
  ],
  templateUrl: './wallet-transaction-list.component.html',
  styleUrl: './wallet-transaction-list.component.scss',
})
export class WalletTransactionListComponent implements OnInit {
  filtersForm: FormGroup = new FormGroup({});
  // totalItems: number = 100;
  // pageSize: number = 10;
  pagination: PaginationDto = {};
  currentPage: number = 1;
  transactions: WalletTransactionDto[] = [];

  constructor(
    private walletTransactionService: WalletTransactionService,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      orderId: [''],
      store: [''],
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadTransactions();
  }

  onFilter(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const filters = this.filtersForm.value;

    const payload = {
      startDate: filters.startDate
        ? toUtcStartOfDayLocal(filters.startDate)
        : null,
      endDate: filters.endDate ? toUtcEndOfDayLocal(filters.endDate) : null,
      orderId: filters.orderId?.trim() || null,
      store: filters.store?.trim() || null,
      page: this.currentPage,
    };

    this.walletTransactionService.getAll(payload).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.transactions = response.data;
        this.pagination = response.pagination;
        console.log('Transactions:', this.transactions);
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }

  onPageChange(page: number): void {
    console.log('Page changed:', page);
    this.currentPage = page;
    this.loadTransactions();
  }
}
