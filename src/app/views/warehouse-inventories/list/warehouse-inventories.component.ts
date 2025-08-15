import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  ButtonDirective,
  ButtonModule,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
} from '@coreui/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
import { ProductDto } from '../../../models/product.dto';
import { WarehouseInventoryFilter } from '../../../models/warehouse-inventory-filter.model';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { AuthService } from '../../../services/auth.service';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { InventoryTableComponent } from '../../../shared/components/inventory-table/inventory-table.component';

@Component({
  selector: 'app-warehouse-inventories',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    ButtonModule,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ReactiveFormsModule,
    LoadingOverlayComponent,
    IconDirective,
    NgSelectModule,
    HasRoleDirective,
    GenericPaginationComponent,
    InventoryTableComponent,
  ],
  templateUrl: './warehouse-inventories.component.html',
  styleUrls: ['./warehouse-inventories.component.scss'],
})
export class WarehouseInventoriesComponent implements OnInit {
  isLoading: boolean = false;
  filteredProducts: ProductDto[] = [];
  pagination: PaginationDto = {
    page: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  };
  filterForm: FormGroup;
  icons = freeSet;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private warehouseInventoryService: WarehouseInventoryService,
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      query: [''],
      storeId: [
        this.authService.hasRole('tienda')
          ? this.authService.getStoreId()
          : null,
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const filter: WarehouseInventoryFilter = {
      ...this.filterForm.value,
      page: this.currentPage,
      pageSize: this.pageSize,
    };

    this.warehouseInventoryService.getWarehouseInventories(filter).subscribe({
      next: (response) => {
        this.filteredProducts = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading warehouse inventories:', error);
        this.isLoading = false;
      },
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  resetFilters(): void {
    this.filterForm.patchValue({
      query: '',
      storeId: this.authService.hasRole('tienda')
        ? this.authService.getStoreId()
        : null,
    });
    this.currentPage = 1;
    this.loadData();
  }

  getTotalQuantity(variants: any[]): number {
    return variants.reduce(
      (total, variant) => total + (variant.quantity || 0),
      0
    );
  }

  getWarehouseNames(variants: any[]): string {
    const warehouses = new Set<string>();
    variants.forEach((variant) => {
      if (variant.warehouseName) {
        warehouses.add(variant.warehouseName);
      }
    });
    return Array.from(warehouses).join(', ');
  }

  hasWarehouseInfo(variants: any[]): boolean {
    return variants.some((variant) => variant.warehouseName);
  }

  downloadSku() {
    this.isLoading = true;
    this.warehouseInventoryService
      .export({ storeId: this.authService.getStoreId() ?? 0, isAll: true })
      .subscribe((response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `SKU_${new Date()
          .toISOString()
          .replace('T', '_')
          .replace(/:/g, '-')
          .substring(0, 16)}.xlsx`;
        a.click();
        this.isLoading = false;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onRefreshData() {
    this.loadData();
  }
}
