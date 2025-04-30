import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionDto } from '../../../models/wallet-transaction.dto';
import { WalletTransactionService } from '../../../services/wallet-transaction.service';
import { ReactiveFormsModule } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  SpinnerComponent,
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
    LoadingOverlayComponent,
    NgSelectModule,
    IconDirective
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
      page: this.currentPage
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
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'Transacciones.xlsx';
        a.click();
        this.isLoading = false;
      });
  }
}
