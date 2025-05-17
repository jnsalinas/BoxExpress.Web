import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  RowComponent,
  ColComponent,
  TableDirective,
} from '@coreui/angular';
import { WarehouseService } from '../../../services/warehouse.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { WarehouseDetailDto } from '../../../models/warehouse-detail.dto';
import { WarehouseProductModalComponent } from '../components/warehouse-product-modal/warehouse-product-modal.component';
import { ProductDto } from '../../../models/product.dto';
import { ProductVariantDto } from '../../../models/product-variant.dto';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { WarehouseTransferModalComponent } from '../components/warehouse-transfer-modal/warehouse-transfer-modal.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { WarehouseInventoriesService } from '../../../services/warehouse-inventories.service';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { WarehouseInventoryFilter } from '../../../models/warehouse-inventory-filter.model';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    RowComponent,
    FormsModule,
    WarehouseProductModalComponent,
    WarehouseTransferModalComponent,
    TableDirective,
    GenericModalComponent,
    GenericPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    // IconDirective
  ],
  templateUrl: './warehouse-detail.component.html',
})
export class WarehouseDetailComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  private route = inject(ActivatedRoute);
  isModalInventoryVisible = false;
  isModalTransferVisible = false;
  productToEdit: ProductDto | null = null;
  warehouseId: number = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
  warehouseDetail: WarehouseDetailDto | undefined;
  filteredProducts: ProductDto[] | null = null;
  searchTerm: string = '';
  loading = false;
  icons = freeSet;
  currentPage: number = 1;
  pagination: PaginationDto | null = null;
  filtersForm: FormGroup = new FormGroup({});

  constructor(
    private warehouseService: WarehouseService,
    private warehouseInventoriesService: WarehouseInventoriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.filtersForm = this.fb.group({
      query: [null],
    });

    this.loadWarehouseDetail();
  }

  loadWarehouseDetail(id: number = this.warehouseId): void {
    this.warehouseService.getById(id).subscribe({
      next: (result) => {
        this.warehouseDetail = result;
        // this.filteredProducts = this.warehouseDetail?.products ?? [];
        this.loadWarehouseInventories();
      },
      error: (err) => {
        console.error('Error loading warehouses', err);
      },
    });
  }

  loadWarehouseInventories(): void {
    this.warehouseInventoriesService
      .getWarehouseProductSummaryAsync(this.getFilters())
      .subscribe({
        next: (response) => {
          console.log('Warehouse inventories:', response);
          if (this.warehouseDetail) {
            // this.warehouseDetail.products = result;
            this.filteredProducts = response.data ?? [];
            this.pagination = response.pagination;
          }
        },
        error: (err) => {
          console.error('Error loading warehouses', err);
        },
      });
  }

  filterProducts(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = this.warehouseDetail?.products ?? [];
    } else {
      this.filteredProducts = (this.warehouseDetail?.products ?? []).filter(
        (p) => p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterProducts();
  }

  //#region Inventory
  openInventoryModal(productDto: ProductDto | null = null) {
    if (productDto) {
      this.productToEdit = productDto;
    }
    this.isModalInventoryVisible = true;
  }

  handleInventoryClose(data: any) {
    console.log('Modal closed with data:', data);
    this.isModalInventoryVisible = false;
    this.productToEdit = null;
  }

  handleInventorySave(data: any) {
    console.log('Saved data:', data);
    this.loading = true;
    this.warehouseService
      .addInventory(this.warehouseId!, data.products)
      .subscribe({
        next: (data) => {
          console.log('Warehouse created:', data);
          this.loading = false;
          this.handleInventoryClose(null);
        },
        error: (err) => {
          console.error('Error loading warehouses', err);
          this.handleInventoryClose(null);
        },
      });
  }

  editProduct(product: ProductDto) {
    this.openInventoryModal(product);
  }
  //#endregion

  //#region Transfer
  openTransferModal() {
    this.isModalTransferVisible = true;
  }

  handleTransferClose(data: any) {
    this.isModalTransferVisible = false;
  }

  handleTransferSave(data: any) {
    this.modal.show({
      title: 'Aceptar transferencia',
      body: `¿Estás seguro de que desea crear la transferencia?`,
      ok: () => {
        console.log('Saved data:', data);
        this.loading = true;
        this.warehouseService.transfer(this.warehouseId!, data).subscribe({
          next: (data) => {
            console.log('Warehouse transfer:', data);
            this.loading = false;
            this.handleTransferClose(null);
          },
          error: (err) => {
            console.error('Error loading warehouses', err);
            this.handleTransferClose(null);
          },
        });
      },
      close: () => {},
    });
  }
  //#endregion
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWarehouseInventories();
  }

  onFilter(): void {
    this.loadWarehouseInventories();
  }

  getFilters(): WarehouseInventoryFilter {
    const filters = this.filtersForm.value;
    const payload: WarehouseInventoryFilter = {
      warehouseId: this.warehouseId,
      page: this.currentPage,
      query: filters.query || null,
    };
    return payload;
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadWarehouseInventories();
  }
}
