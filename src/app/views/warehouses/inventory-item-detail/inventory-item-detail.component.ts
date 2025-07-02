import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
// import { warehouseInventoryDto } from 'src/app/models/product-variant.dto';
import { UtcDatePipe } from 'src/app/shared/pipes/utc-date.pipe';
import { CommonModule } from '@angular/common';
import { InventoryHoldDto } from 'src/app/models/inventory-hold.dto';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { GenericPaginationComponent } from 'src/app/shared/components/generic-pagination/generic-pagination.component';
import { LoadingOverlayComponent } from 'src/app/shared/components/loading-overlay/loading-overlay.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconDirective } from '@coreui/icons-angular';
import { WarehouseTransferModalDetailComponent } from '../../warehouse-transfers/components/warehouse-transfer-modal-detail/warehouse-transfer-modal-detail.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { freeSet } from '@coreui/icons';
import { InventoryMovementService } from '../../../services/inventory-movement.service';
import { InventoryMovementDto } from 'src/app/models/inventory-movement.dto';
import { PaginationDto } from 'src/app/models/common/pagination.dto';
import { InventoryMovementFilter } from 'src/app/models/inventory-movement-filter.model';
import { WarehouseInventoryDto } from 'src/app/models/warehouse-inventory.dto';
import { InventoryHoldService } from 'src/app/services/inventory-hold.service';
import {
  InventoryMovementType,
  InventoryMovementTypeText,
} from 'src/app/models/enums/inventory-movement-type.enum';
import {
  InventoryHoldStatus,
  InventoryHoldStatusText,
} from '../../../models/enums/inventory-hold-status.enum';

@Component({
  selector: 'app-inventory-item-detail',
  imports: [
    UtcDatePipe,
    CommonModule,
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
    RouterLink,
  ],
  templateUrl: './inventory-item-detail.component.html',
  styleUrl: './inventory-item-detail.component.scss',
})
export class InventoryItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  warehouseInventory!: WarehouseInventoryDto;
  inventoryMovements: InventoryMovementDto[] = [];
  inventoryHolds: InventoryHoldDto[] = [];
  pagination: PaginationDto = {};
  icons = freeSet;
  isLoading = false;
  currentPage: number = 1;
  filtersForm: FormGroup = new FormGroup({});

  constructor(
    private warehouseInventoryService: WarehouseInventoryService,
    private fb: FormBuilder,
    private inventoryMovementService: InventoryMovementService,
    private inventoryHoldService: InventoryHoldService
  ) {}

  ngOnInit(): void {
    this.loadwarehouseInventory();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadInventoryMovements();
  }

  onFilter(): void {
    this.loadInventoryMovements();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadInventoryMovements();
  }

  getFilters(): InventoryMovementFilter {
    const filters = this.filtersForm.value;
    return {
      page: this.currentPage,
      productVariantId: this.warehouseInventory?.productVariant?.id,
    };
  }

  loadwarehouseInventory() {
    const warehouseInventoryId =
      this.route.snapshot.paramMap.get('inventoryItemId');
    if (warehouseInventoryId) {
      this.warehouseInventoryService
        .getById(parseInt(warehouseInventoryId))
        .subscribe((warehouseInventory) => {
          this.warehouseInventory = warehouseInventory;
          this.loadInventoryMovements();
          this.loadInventoryHolds();
        });
    }
  }
  loadInventoryHolds() {
    this.inventoryHoldService
      .getAll({
        warehouseInventoryId: this.warehouseInventory.id,
        statuses: [
          InventoryHoldStatus.PendingReturn,
          InventoryHoldStatus.Active,
        ],
      })
      .subscribe({
        next: (response) => {
          this.inventoryHolds = response.data;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
      });
  }

  loadInventoryMovements() {
    this.isLoading = true;
    this.inventoryMovementService.getAll(this.getFilters()).subscribe({
      next: (response) => {
        this.inventoryMovements = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
    });
  }

  getStatusLabel(status?: InventoryHoldStatus): string {
    return InventoryHoldStatusText[status!] ?? 'Desconocido';
  }

  getInventoryMovementTypeText(type: InventoryMovementType): string {
    return InventoryMovementTypeText[type] ?? 'Desconocido';
  }

  downloadExcel() {}
}

// pagination: PaginationDto = {};
//   currentPage: number = 1;
//   filtersForm: FormGroup = new FormGroup({});

//   constructor(private storeService: StoreService, private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.filtersForm = this.fb.group({
//       name: [null],
//     });
//     this.loadStores();
//   }

//   resetFilters(): void {
//     this.filtersForm.reset();
//     this.loadStores();
//   }

//   onFilter(): void {
//     this.loadStores();
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadStores();
//   }

//   getFilters(): StoreFilter {
//     const filters = this.filtersForm.value;
//     return {
//       name: filters.name || null,
//       page: this.currentPage,
//     };
//   }
