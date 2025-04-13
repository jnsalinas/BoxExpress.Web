import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  RowComponent,
  ColComponent,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective,
  AccordionButtonDirective,
} from '@coreui/angular';
import { WarehouseService } from '../../../services/warehouse.service';
import { FormsModule } from '@angular/forms';
import { WarehouseDetailDto } from '../../../models/warehouse-detail.dto';
import { ProductDetailDto } from '../../../models/product-detail.dto';

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
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    AccordionButtonDirective,
    FormsModule,
  ],
  templateUrl: './warehouse-detail.component.html',
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  warehouseDetail: WarehouseDetailDto | null = null;
  filteredProducts: ProductDetailDto[] | null = null;
  searchTerm: string = '';

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadWarehouseDetail(parseInt(id ?? '0'));
  }

  loadWarehouseDetail(id: number): void {
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
}
