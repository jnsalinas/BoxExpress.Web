import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { CreateWarehouseDto } from '../../../models/create-warehouse.dto';
import { WarehouseFilter } from '../../../models/warehouse-filter.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';

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
    RouterLink,
    GenericModalComponent,
  ],
})
export class WarehousesComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  @ViewChild('createModal') createModal!: WarehouseCreateModalComponent;
  selectedWarehouseId: number | undefined;
  icons = freeSet;
  showCreateModal = false;
  warehouses: WarehouseDto[] = [];
  isLoading = false;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.isLoading = true;
    const filter: WarehouseFilter = {};
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
    this.showCreateModal = true;
  }

  onModalClose() {
    this.showCreateModal = false;
  }

  onModalSave(warehouseData: CreateWarehouseDto) {
    this.modal.show({
      title: '¿Estás seguro de que deseas crear esta bodega?',
      body: 'Esta acción no se puede deshacer',
      ok: () => {
        this.warehouseService.createWarehouse(warehouseData).subscribe({
          next: (response) => {
            this.showCreateModal = false;
            this.loadWarehouses();
          },
          error: (error) => {
            console.error('Error al crear bodega:', error);
            if (this.createModal) {
              this.createModal.resetLoading();
            }
          },
        });
      },
    });
  }
}
