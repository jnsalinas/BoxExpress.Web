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
import { ProductDto } from 'src/app/models/product.dto';
import { ProductVariantDto } from 'src/app/models/product-variant.dto';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

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
    TableDirective,
    IconDirective
  ],
  templateUrl: './warehouse-detail.component.html',
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  isModalVisible = false;
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
      next: (data) => {
        this.warehouseDetail = data;
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

  openModal(productDto: ProductDto | null = null) {
    if(productDto){
      this.productToEdit = productDto;
    }
    this.isModalVisible = true;
  }
  
  handleClose(data: any) {
    console.log('Modal closed with data:', data);
    this.isModalVisible = false;
    this.productToEdit = null;
  }

  handleSave(data: any) {
    console.log('Saved data:', data);
    this.loading = true;
    // this.warehouseService
    //   .addInventory(this.warehouseId!, data.products)
    //   .subscribe({
    //     next: (data) => {
    //       console.log('Warehouse created:', data);
    //       this.loading = false;
    //       this.handleClose(null);
    //     },
    //     error: (err) => {
    //       console.error('Error loading warehouses', err);
    //       this.handleClose(null);
    //     },
    //   });
  }

  editProduct(product: ProductDto) {
    this.openModal(product)
  }
  
  deleteProduct(product: ProductDto) {
    // confirmación + lógica para borrar
  }
  
  editVariant(product: ProductDto, variant: ProductVariantDto) {
    // abre modal con los datos del producto y la variante
  }
  
  deleteVariant(product: ProductDto, variant: ProductVariantDto) {
    // confirmación + lógica para borrar
  }
  
}
