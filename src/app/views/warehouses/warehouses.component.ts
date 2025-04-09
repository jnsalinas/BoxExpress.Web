import { Component, OnInit } from '@angular/core';
import { WarehouseService } from 'src/app/services/warehouse.service';
import {  WarehouseDto } from 'src/app/models/warehouse.dto';
import {  WarehouseFilter } from 'src/app/models/warehouse-filter.model';
import { CommonModule } from '@angular/common';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective
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
  ]
})

export class WarehousesComponent implements OnInit {
  warehouses: WarehouseDto[] = [];
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
}
