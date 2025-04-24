import { Component, inject, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { WarehouseDetailDto } from '../../../models/warehouse-detail.dto';
import { WarehouseProductModalComponent } from '../components/warehouse-product-modal/warehouse-product-modal.component';
import { ProductDto } from '../../../models/product.dto';
import { ProductVariantDto } from '../../../models/product-variant.dto';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { WarehouseTransferModalComponent } from '../components/warehouse-transfer-modal/warehouse-transfer-modal.component';

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
    // IconDirective
  ],
  templateUrl: './warehouse-detail.component.html',
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  isModalInventoryVisible = false;
  isModalTransferVisible = false;
  productToEdit: ProductDto | null = null;
  warehouseId: number = parseInt(this.route.snapshot.paramMap.get('id') ?? '0')
  warehouseDetail: WarehouseDetailDto | undefined;
  filteredProducts: ProductDto[] | null = null;
  searchTerm: string = '';
  loading = false;
  icons = freeSet;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadWarehouseDetail();
  }

  loadWarehouseDetail(id: number = this.warehouseId): void {
    this.warehouseService.getById(id).subscribe({
      next: (result) => {
        this.warehouseDetail = result;
        this.filteredProducts = this.warehouseDetail?.products ?? [];
        console.log('warehouseDetail', this.warehouseDetail);

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
    if(productDto){
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
    this.openInventoryModal(product)
  }
  //#endregion

  //#region Transfer
  openTransferModal() { 
    this.isModalTransferVisible = true;
  }

  handleTransferClose(data: any) {
    console.log('Modal closed with data:', data);
    this.isModalTransferVisible = false;
  }

  handleTransferSave(data: any) {
    console.log('Saved data:', data);
    this.loading = true;
    // this.warehouseService
    //   .addInventory(this.warehouseId!, data.products)
    //   .subscribe({
    //     next: (data) => {
    //       console.log('Warehouse created:', data);
    //       this.loading = false;
    //       this.handleInventoryClose(null);
    //     },
    //     error: (err) => {
    //       console.error('Error loading warehouses', err);
    //       this.handleInventoryClose(null);
    //     },
    //   });
  }
  //#endregion
  
}
