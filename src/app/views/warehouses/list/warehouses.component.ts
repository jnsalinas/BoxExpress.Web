import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { CreateWarehouseDto } from '../../../models/create-warehouse.dto';
import { WarehouseFilter } from '../../../models/warehouse-filter.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { WarehouseCreateModalComponent } from '../components/warehouse-create-modal/warehouse-create-modal.component';

import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';

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
    IconDirective,
    WarehouseCreateModalComponent,
    HasRoleDirective,
  ],
})
export class WarehousesComponent implements OnInit {
  @ViewChild('createModal') createModal!: WarehouseCreateModalComponent;
  
  //todo: renombrar a WrehousesListComponent
  selectedWarehouseId: number | undefined;
  icons = freeSet;
  showCreateModal = false;

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

  openCreateModal() {
    console.log('Abriendo modal de crear bodega...');
    this.showCreateModal = true;
    console.log('showCreateModal:', this.showCreateModal);
  }

  onModalClose() {
    this.showCreateModal = false;
    console.log('Modal cerrado');
  }

  onModalSave(warehouseData: CreateWarehouseDto) {
    console.log('Datos de bodega recibidos:', warehouseData);
    
    this.warehouseService.createWarehouse(warehouseData).subscribe({
      next: (response) => {
        console.log('Bodega creada exitosamente:', response);
        this.showCreateModal = false;
        // Recargar la lista de bodegas
        this.loadWarehouses();
      },
      error: (error) => {
        console.error('Error al crear bodega:', error);
        // Resetear el loading del modal en caso de error
        if (this.createModal) {
          this.createModal.resetLoading();
        }
        // Aquí podrías mostrar un mensaje de error al usuario
      }
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
