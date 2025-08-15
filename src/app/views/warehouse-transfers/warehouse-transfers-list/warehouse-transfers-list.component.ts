import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseInventoryTransferService } from '../../../services/warehouse-inventory-transfer.service';
import { WarehouseInventoryTransferDto } from 'src/app/models/warehouse-inventory-transfer.dto';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
  BadgeModule,
} from '@coreui/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtcDatePipe } from '../../../shared/pipes/utc-date.pipe';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconDirective } from '@coreui/icons-angular';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { WarehouseInventoryTransferFilter } from '../../../models/warehouse-inventory-transfer-filter.model';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseDto } from '../../../models/warehouse.dto';
import {
  WarehouseTransferStatus,
  WarehouseTransferStatusText,
} from '../../../constants/warehouse-transfer-status';
import { freeSet } from '@coreui/icons';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../shared/utils/date-utils';
import { WarehouseTransferModalDetailComponent } from '../components/warehouse-transfer-modal-detail/warehouse-transfer-modal-detail.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';

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
    WarehouseTransferModalDetailComponent,
    GenericModalComponent,
    BadgeModule,
  ],
  templateUrl: './warehouse-transfers-list.component.html',
  styleUrl: './warehouse-transfers-list.component.scss',
})
export class WarehouseTransfersListComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  isLoading: boolean = false;
  warehouseInventoryTransfers: WarehouseInventoryTransferDto[] = [];
  warehouseOptions: WarehouseDto[] = [];
  currentPage: number = 1;
  pagination: PaginationDto = {};
  icons = freeSet;
  filtersForm: FormGroup = new FormGroup({});
  rejectForm: FormGroup = new FormGroup({});
  warehouseInventoryTransfer: WarehouseInventoryTransferDto | null = null;
  statusOptions = Object.entries(WarehouseTransferStatusText).map(
    ([key, label]) => ({
      value: Number(key),
      label,
    })
  );

  showRejectModal = false;

  constructor(
    private warehouseInventoryTransferService: WarehouseInventoryTransferService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      toWarehouseId: [null],
      fromWarehouseId: [null],
      statusId: [null],
    });

    this.rejectForm = this.fb.group({
      rejectionReason: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.loadWarehouseInventoryTransfer();
    this.loadWarehouse();
  }

  loadWarehouseInventoryTransfer() {
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
    this.loadWarehouseInventoryTransfer();
  }

  getFilters(): WarehouseInventoryTransferFilter {
    const filters = this.filtersForm.value;
    const payload: WarehouseInventoryTransferFilter = {
      startDate: filters.startDate
        ? toUtcStartOfDayLocal(filters.startDate)
        : null,
      endDate: filters.endDate ? toUtcEndOfDayLocal(filters.endDate) : null,
      fromWarehouseId: filters.fromWarehouseId ?? null,
      toWarehouseId: filters.toWarehouseId ?? null,
      statusId: filters.statusId ?? null,
      page: this.currentPage,
    };
    return payload;
  }

  getStatusLabel(status?: WarehouseTransferStatus): string {
    return WarehouseTransferStatusText[status!] ?? 'Desconocido';
  }

  onFilter(): void {
    this.loadWarehouseInventoryTransfer();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadWarehouseInventoryTransfer();
  }

  downloadExcel() {
    this.warehouseInventoryTransferService
      .export(this.getFilters())
      .subscribe((response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        const dateTimeString = new Date()
          .toISOString()
          .replace('T', '_')
          .replace(/:/g, '-')
          .substring(0, 16);

        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `TransferenciaInventarios_${dateTimeString}.xlsx`;
        a.click();
        this.isLoading = false;
      });
  }

  showDetail(itemSelected: WarehouseInventoryTransferDto) {
    this.warehouseInventoryTransfer = itemSelected;
  }

  onModalDetailClose(event?: any) {
    this.warehouseInventoryTransfer = null;
  }

  onModalAccept(event: any) {
    if (this.warehouseInventoryTransfer != null) {
      this.modal.show({
        title: 'Aceptar transferencia',
        body: `¿Estás seguro de que desea aceptar la transferencia?`,
        ok: () => {
          this.warehouseInventoryTransferService
            .accept(this.warehouseInventoryTransfer!.id)
            .subscribe({
              next: (response) => {
                console.log(response, 'response accept');
                this.onModalDetailClose();
                this.loadWarehouseInventoryTransfer();
              },
            });
        },
        close: () => {},
      });
    }
  }

  onModalReject(event: any) {
    if (this.warehouseInventoryTransfer != null) {
      this.showRejectModal = true;
      // this.modal.show({
      //   title: 'Rechazar transferencia',
      //   body: `¿Estás seguro de que desea rechazar la transferencia?`,
      //   ok: () => {
      //     this.warehouseInventoryTransferService
      //       .reject(this.warehouseInventoryTransfer!.id)
      //       .subscribe({
      //         next: (response) => {
      //           console.log(response, 'response accept');
      //           this.onModalDetailClose();
      //           this.loadWarehouseInventoryTransfer();
      //         },
      //       });
      //   },
      //   close: () => {},
      // });
    }
  }

  onConfirmReject() {
    this.warehouseInventoryTransferService
      .reject(this.warehouseInventoryTransfer!.id, {
        reason: this.rejectForm.value.rejectionReason,
      })
      .subscribe({
        next: (response) => {
          console.log(response, 'response accept');
          this.onModalDetailClose();
          this.loadWarehouseInventoryTransfer();
        },
      });
  }

  onCancelReject() {
    this.showRejectModal = false;
  }
}
