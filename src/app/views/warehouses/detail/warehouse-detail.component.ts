import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkWithHref,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
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
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { WarehouseTransferModalComponent } from '../components/warehouse-transfer-modal/warehouse-transfer-modal.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { WarehouseInventoryFilter } from '../../../models/warehouse-inventory-filter.model';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { WarehouseInventoryItemEditModalComponent } from '../../warehouse-transfers/components/warehouse-inventory-item-edit-modal/warehouse-inventory-item-edit-modal.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { MessageService } from '../../../services/message.service';
import { InventoryTableComponent } from '../../../shared/components/inventory-table/inventory-table.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    FormsModule,
    WarehouseProductModalComponent,
    WarehouseTransferModalComponent,
    GenericModalComponent,
    GenericPaginationComponent,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    RouterLinkWithHref,
    LoadingOverlayComponent,
    WarehouseInventoryItemEditModalComponent,
    HasRoleDirective,
    InventoryTableComponent,
    IconDirective,
    IconModule,
  ],
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss'],
})
export class WarehouseDetailComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  @ViewChild(WarehouseInventoryItemEditModalComponent)
  inventoryItemModal!: WarehouseInventoryItemEditModalComponent;
  @ViewChild(WarehouseProductModalComponent)
  inventoryModal!: WarehouseProductModalComponent;
  private route = inject(ActivatedRoute);
  isModalInventoryVisible = false;
  isModalTransferVisible = false;
  productToEdit: ProductDto | null = null;
  warehouseId: number = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');
  warehouseDetail: WarehouseDetailDto | undefined;
  filteredProducts: ProductDto[] | null = null;
  searchTerm: string = '';
  isLoading = false;
  icons = freeSet;
  currentPage: number = 1;
  pagination: PaginationDto | null = null;
  filtersForm: FormGroup = new FormGroup({});
  warehouseInventoryId: number | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private warehouseInventoryService: WarehouseInventoryService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public authService: AuthService
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
        console.error('Error isLoading warehouses', err);
      },
    });
  }

  loadWarehouseInventories(): void {
    this.isLoading = true;
    this.warehouseInventoryService
      .getWarehouseInventories(this.getFilters())
      .subscribe({
        next: (response) => {
          console.log('Warehouse inventories:', response);
          if (this.warehouseDetail) {
            // this.warehouseDetail.products = result;
            this.filteredProducts = response.data ?? [];
            this.pagination = response.pagination;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error isLoading warehouses', err);
          this.isLoading = false;
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
    // Resetear el estado de guardado en el modal
    if (this.inventoryModal) {
      this.inventoryModal.resetSavingState();
    }
  }

  handleInventorySave(data: any) {
    console.log('Saved data:', data);
    this.warehouseService
      .addInventory(this.warehouseId!, data.products)
      .subscribe({
        next: (data) => {
          console.log('Warehouse created:', data);
          this.handleInventoryClose(null);
          this.loadWarehouseInventories(); // Recargar la lista
          // Resetear el estado de guardado en el modal
          if (this.inventoryModal) {
            this.inventoryModal.resetSavingState();
          }
          this.messageService.showSuccess('Inventario creado correctamente');
        },
        error: (err) => {
          console.log('Error isLoading warehouses', err);
          console.error('Error isLoading warehouses', err);
          this.handleInventoryClose(null);
          // Resetear el estado de guardado en el modal
          if (this.inventoryModal) {
            this.inventoryModal.resetSavingState();
          }
          this.messageService.showMessageError(err);
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
        this.isLoading = true;
        this.warehouseService.transfer(this.warehouseId!, data).subscribe({
          next: (data) => {
            this.messageService.showSuccess(
              'Transferencia creada correctamente'
            );
            this.isLoading = false;
            this.handleTransferClose(null);
          },
          error: (err) => {
            console.error('Error isLoading warehouses', err);
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

  // //#region Inventory Item Edit
  // openInventoryItemModal(variant: ProductVariantDto) {
  //   console.log('Selected variant:', variant);
  //   this.warehouseInventoryId = variant.warehouseInventoryId ?? null;
  // }

  handleInventoryItemSave(data: any) {
    console.log('Saved data:', data);
    this.modal.show({
      title: 'Actualizar inventario',
      body: `¿Estás seguro de que desea actualizar el inventario?`,
      ok: () => {
        if (this.warehouseInventoryId != null) {
          console.log('Saved data:', data);
          this.warehouseInventoryService
            .update(this.warehouseInventoryId, data)
            .subscribe({
              next: (data) => {
                this.handleInventoryItemClose();
                this.loadWarehouseInventories();
                this.warehouseInventoryId = null;
                // Resetear el estado de guardado en el modal
                if (this.inventoryItemModal) {
                  this.inventoryItemModal.resetSavingState();
                }
                this.messageService.showSuccess("Inventario actualizado");
              },
              error: (err) => {
                console.error('Error isLoading warehouses', err);
                this.handleInventoryItemClose();
                // Resetear el estado de guardado en el modal
                if (this.inventoryItemModal) {
                  this.inventoryItemModal.resetSavingState();
                }
                this.messageService.showMessageError(err);
              },
            });
        } else {
          this.handleInventoryItemClose();
        }
      },
      close: () => {
        // Resetear el estado de guardado si se cancela
        if (this.inventoryItemModal) {
          this.inventoryItemModal.resetSavingState();
        }
      },
    });
  }

  handleInventoryItemClose() {
    this.warehouseInventoryId = null;
    // Resetear el estado de guardado en el modal
    if (this.inventoryItemModal) {
      this.inventoryItemModal.resetSavingState();
    }
  }

  onAddVariant(product: ProductDto) {
    console.log('Add variant:', product);
    this.editProduct(product);
  }
  //#endregion

  onRefreshData() {
    this.loadWarehouseInventories();
  }
}
