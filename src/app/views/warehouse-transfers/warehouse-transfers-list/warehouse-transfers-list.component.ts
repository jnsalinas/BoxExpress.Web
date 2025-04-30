import { Component, OnInit } from '@angular/core';
import { WarehouseInventoryTransferService } from '../../../services/warehouse-inventory-transfer.service';
import { WarehouseInventoryTransferDto } from 'src/app/models/warehouse-inventory-transfer.dto';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtcDatePipe } from 'src/app/shared/pipes/utc-date.pipe';
import { GenericPaginationComponent } from 'src/app/shared/components/generic-pagination/generic-pagination.component';
import { LoadingOverlayComponent } from 'src/app/shared/components/loading-overlay/loading-overlay.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconDirective } from '@coreui/icons-angular';
import { PaginationDto } from 'src/app/models/common/pagination.dto';
import { WarehouseInventoryTransferFilter } from 'src/app/models/warehouse-inventory-transfer-filter.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { WarehouseDto } from 'src/app/models/warehouse.dto';
import {
  WarehouseTransferStatus,
  WarehouseTransferStatusText,
} from 'src/app/constants/warehouse-transfer-status';
import { freeSet } from '@coreui/icons';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../shared/utils/date-utils';
import { WarehouseTransferModalDetailComponent } from '../components/warehouse-transfer-modal-detail/warehouse-transfer-modal-detail.component';

@Component({
  selector: 'app-warehouse-transfers-list',
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
    IconDirective,
    WarehouseTransferModalDetailComponent
  ],
  templateUrl: './warehouse-transfers-list.component.html',
  styleUrl: './warehouse-transfers-list.component.scss',
})
export class WarehouseTransfersListComponent implements OnInit {
  isLoading: boolean = false;
  warehouseInventoryTransfers: WarehouseInventoryTransferDto[] = [];
  warehouseOptions: WarehouseDto[] = [];
  currentPage: number = 1;
  pagination: PaginationDto = {};
  icons = freeSet;
  filtersForm: FormGroup = new FormGroup({});

  constructor(
    private warehouseInventoryTransferService: WarehouseInventoryTransferService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      warehouseDestinationId: [null],
      warehouseOriginId: [null],
    });
    this.loadWarehouseInventoryTransferDto();
    this.loadWarehouse();
  }

  loadWarehouseInventoryTransferDto() {
    this.isLoading = true;
    this.warehouseInventoryTransferService.getAll(this.getFilters()).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.warehouseInventoryTransfers = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  loadWarehouse() {
    this.warehouseService.getAll().subscribe({
      next: (response) => {
        this.warehouseOptions = response.data;
      },
    });
  }

  onPageChange(page: number): void {
    console.log('Page changed:', page);
    this.currentPage = page;
    this.loadWarehouseInventoryTransferDto();
  }

  getFilters(): WarehouseInventoryTransferFilter {
    const filters = this.filtersForm.value;
    const payload: WarehouseInventoryTransferFilter = {
      startDate: filters.startDate
        ? toUtcStartOfDayLocal(filters.startDate)
        : null,
      endDate: filters.endDate ? toUtcEndOfDayLocal(filters.endDate) : null,
      warehouseOriginId: filters.warehouseOriginId ?? null,
      warehouseDestinationId: filters.warehouseDestinationId ?? null,
      page: this.currentPage,
    };
    return payload;
  }

  getStatusLabel(status?: WarehouseTransferStatus): string {
    return WarehouseTransferStatusText[status!] ?? 'Desconocido';
  }

  onFilter(): void {
    this.loadWarehouseInventoryTransferDto();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadWarehouseInventoryTransferDto();
  }
}
