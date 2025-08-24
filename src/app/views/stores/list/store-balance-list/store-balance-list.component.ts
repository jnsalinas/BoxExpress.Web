import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { freeSet } from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { StoreDto } from '../../../../models/store.dto';
import { StoreService } from '../../../../services/store.service';
import { LoadingOverlayComponent } from '../../../../shared/components/loading-overlay/loading-overlay.component';
import { PaginationDto } from '../../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../../../../shared/components/generic-pagination/generic-pagination.component';
import { StoreFilter } from '../../../../models/store-filter.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../../shared/utils/date-utils';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreCreateModalComponent } from '../../components/store-create-modal/store-create-modal.component';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';

@Component({
  standalone: true,
  selector: 'app-store-balance-list',
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    LoadingOverlayComponent,
    GenericPaginationComponent,
    NgSelectModule,
    ReactiveFormsModule,
    IconDirective,
    StoreCreateModalComponent,
    HasRoleDirective,
    IconModule,
    IconDirective,
  ],
  templateUrl: './store-balance-list.component.html',
  styleUrl: './store-balance-list.component.scss',
})
export class StoreBalanceListComponent implements OnInit {
  isLoading: boolean = false;
  stores: StoreDto[] = [];
  icons = freeSet;
  pagination: PaginationDto = {};
  currentPage: number = 1;
  filtersForm: FormGroup = new FormGroup({});
  storeId: number | null = null;
  constructor(private storeService: StoreService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      name: [null],
    });
    this.loadStores();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadStores();
  }

  onFilter(): void {
    this.loadStores();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStores();
  }

  getFilters(): StoreFilter {
    const filters = this.filtersForm.value;
    return {
      name: filters.name || null,
      page: this.currentPage,
    };
  }

  loadStores() {
    this.isLoading = true;
    this.storeService.getAll(this.getFilters()).subscribe({
      next: (response) => {
        this.stores = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.isLoading = false;
      },
    });
  }

  downloadExcel() {
    this.isLoading = true;
    this.storeService.export(this.getFilters()).subscribe((response: Blob) => {
      const dateTimeString = new Date()
        .toISOString()
        .replace('T', '_')
        .replace(/:/g, '-')
        .substring(0, 16);
      const fileURL = URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `Balance_${dateTimeString}.xlsx`;
      a.click();
      this.isLoading = false;
    });
  }

  onFormSubmit(store: StoreDto) {
    if (this.storeId) {
      this.storeService.update(this.storeId, store).subscribe((response) => {
        this.loadStores();
        this.onCloseModal();
      });
    } else {
      this.storeService.create(store).subscribe((response) => {
        this.loadStores();
        this.onCloseModal();
      });
    }
  }

  editStore(storeId: number) {
    this.storeId = storeId;
  }

  onCloseModal() {
    this.storeId = null;
  }
}
