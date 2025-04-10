import { Component, OnInit } from '@angular/core';
import { WarehouseService } from 'src/app/services/warehouse.service';
import {  WarehouseDto } from 'src/app/models/warehouse.dto';
import {  WarehouseFilter } from 'src/app/models/warehouse-filter.model';
import { CommonModule } from '@angular/common';
import { WarehouseProductModalComponent } from 'src/app/views/warehouses/components/warehouse-product-modal/warehouse-product-modal.component';
import { ModalModule } from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';

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
    WarehouseProductModalComponent,
    RouterLink
  ]
})

export class WarehousesComponent implements OnInit {
  selectedWarehouseId: number | undefined;
  selectedWarehouseName: string = '';

  warehouses: WarehouseDto[] = [
    {
      id: 1,
      name: 'Main Warehouse',
      cityId: 1,
      countryId: 1,
      cityName : 'Bogotá',
      countryName : 'Colombia',
    },
    {
      id: 1,
      name: 'Secondary Warehouse',
      cityId: 1,
      countryId: 1,
      cityName : 'Bogotá',
      countryName : 'Colombia',
    },
  ];
  
  loading = false;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    const filter: WarehouseFilter = {
      // Aquí pones filtros si los necesitas
    }; 
    this.warehouseService.getAll(filter).subscribe({
      next: data => {
        this.warehouses = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading warehouses', err);
        this.loading = false;
      }
    });
  }

  openModal(warehouse: WarehouseDto) {
    this.selectedWarehouseId = warehouse.id;
    this.selectedWarehouseName = warehouse.name;
  }
  
  handleClose(data: any) {
    this.selectedWarehouseId = undefined; 
  }

  handleSave(data: any) {
    console.log('Saved data:', data);
    // Aquí podrías llamar a tu servicio y enviar la data a la API
    this.warehouseService.addInventory(this.selectedWarehouseId!, data.products).subscribe({
      next: data => {
        console.log('Warehouse created:', data);
        this.loading = false;
      },
      error: err => {
        console.error('Error loading warehouses', err);
        this.loading = false;
      }
    });

    this.selectedWarehouseId = undefined; 
  }
}
