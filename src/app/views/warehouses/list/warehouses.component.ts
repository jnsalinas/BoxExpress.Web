import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { WarehouseFilter } from '../../../models/warehouse-filter.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';

import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';

@Component({
  standalone: true,
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss'],
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    RouterLink,
    LoadingOverlayComponent,
  ],
})
export class WarehousesComponent implements OnInit {
  //todo: renombrar a WrehousesListComponent
  selectedWarehouseId: number | undefined;

  warehouses: WarehouseDto[] = [
    {
      id: 1,
      name: 'Main Warehouse',
      cityId: 1,
      countryId: 1,
      cityName: 'Bogotá',
      countryName: 'Colombia',
    },
    {
      id: 1,
      name: 'Secondary Warehouse',
      cityId: 1,
      countryId: 1,
      cityName: 'Bogotá',
      countryName: 'Colombia',
    },
  ];

  isLoading = false;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.isLoading = true;
    const filter: WarehouseFilter = {
      // Aquí pones filtros si los necesitas
    };
    this.warehouseService.getAll(filter).subscribe({
      next: (result) => {
        this.warehouses = result.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error isLoading warehouses', err);
        this.isLoading = false;
      },
    });
  }

  // openModal(warehouse: WarehouseDto) {
  //   this.selectedWarehouseId = warehouse.id;
  //   this.selectedWarehouseName = warehouse.name;
  // }

  // handleClose(data: any) {
  //   this.selectedWarehouseId = undefined;
  // }

  // handleSave(data: any) {
  //   this.warehouseService
  //     .addInventory(this.selectedWarehouseId!, data.products)
  //     .subscribe({
  //       next: (data) => {
  //         console.log('Warehouse created:', data);
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         console.error('Error isLoading warehouses', err);
  //         this.isLoading = false;
  //       },
  //     });

  //   this.selectedWarehouseId = undefined;
  // }
}
