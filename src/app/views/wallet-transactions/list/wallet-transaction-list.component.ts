import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionDto } from '../../../models/wallet-transaction.dto';
import { WalletTransactionService } from '../../../services/wallet-transaction.service';
import { ReactiveFormsModule } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';
import { UtcDatePipe } from '../../../shared/pipes/utc-date.pipe'; // Adjust the path as needed
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../shared/utils/date-utils';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { WalletTransactionFilter } from '../../../models/wallet-transaction-filter.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreDto } from '../../../models/store.dto';
import { StoreService } from '../../../services/store.service';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';

@Component({
  selector: 'app-wallet-transaction-list',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    CommonModule,
    UtcDatePipe,
    GenericPaginationComponent,
    LoadingOverlayComponent,
    NgSelectModule,
    RouterLink,
    HasRoleDirective
  ],
  templateUrl: './wallet-transaction-list.component.html',
  styleUrl: './wallet-transaction-list.component.scss',
})
export class WalletTransactionListComponent implements OnInit {
  @Input() orderId: number | undefined;
  @Input() showFilters: boolean = true;
  filtersForm: FormGroup = new FormGroup({});
  pagination: PaginationDto = {};
  currentPage: number = 1;
  transactions: WalletTransactionDto[] = [];
  isLoading: boolean = false;
  stores: StoreDto[] = [];
  icons = freeSet;

  constructor(
    private walletTransactionService: WalletTransactionService,
    private fb: FormBuilder,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      orderId: [this.orderId ?? null],
      storeId: [null],
      transactionType: [null],
    });
    this.loadTransactions();
    this.loadStores();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadTransactions();
  }

  onFilter(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.walletTransactionService.getAll(this.getFilters()).subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  loadStores(): void {
    this.isLoading = true;
    this.storeService.getAll().subscribe({
      next: (response) => {
        this.stores = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  getFilters(): WalletTransactionFilter {
    const filters = this.filtersForm.value;

    const payload: WalletTransactionFilter = {
      startDate: filters.startDate
        ? toUtcStartOfDayLocal(filters.startDate)
        : null,
      endDate: filters.endDate ? toUtcEndOfDayLocal(filters.endDate) : null,
      orderId: filters.orderId ?? null,
      storeId: filters.storeId || null,
      page: this.currentPage,
    };
    return payload;
  }

  onPageChange(page: number): void {
    console.log('Page changed:', page);
    this.currentPage = page;
    this.loadTransactions();
  }

  downloadExcel() {
    this.isLoading = true;
    this.walletTransactionService
      .export(this.getFilters())
      .subscribe((response: Blob) => {
        const dateTimeString = new Date()
          .toISOString()
          .replace('T', '_')
          .replace(/:/g, '-')
          .substring(0, 16);
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `Transacciones_${dateTimeString}.xlsx`;

        a.click();
        this.isLoading = false;
      });
  }

  getTransactionTypeBadgeClass(type: string | undefined): string {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
        return 'bg-success';
      case 'WITHDRAWAL':
        return 'bg-danger';
      case 'PURCHASE':
        return 'bg-primary';
      case 'REFUND':
        return 'bg-warning';
      case 'TRANSFER':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-danger';
      case 'PROCESSING':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getAmountBadgeClass(amount: number | undefined): string {
    if (!amount) return 'bg-secondary';
    if (amount > 0) {
      return 'bg-success';
    } else if (amount < 0) {
      return 'bg-danger';
    } else {
      return 'bg-secondary';
    }
  }
}
