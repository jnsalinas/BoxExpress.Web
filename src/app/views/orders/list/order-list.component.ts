import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { OrderDto } from '../../../models/order.dto';
import { OrderFilter } from '../../../models/order-filter.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';
import { WarehouseFilter } from '../../../models/warehouse-filter.model';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { OrderTableComponent } from '../components/order-table/order-table.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    OrderTableComponent,
  ],
})
export class OrderListComponent implements OnInit {
  selectedOrderId: number | undefined;
  selectedOrderName: string = '';

  orders: OrderDto[] = [];
  warehouses: WarehouseDto[] = [
    {
      id: 0,
      name: 'Tradicional',
    },
  ];
  loading = false;
  activeTab: number = 1;

  private ordersSubject = new BehaviorSubject<OrderDto[]>([]); // Aquí almacenamos las órdenes
  orders$ = this.ordersSubject.asObservable(); // Observable para los componentes que escuchan cambios

  constructor(
    private orderService: OrderService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.loadOrders({ categoryId: this.activeTab });
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    const filter: WarehouseFilter = {
      // Aquí pones filtros si los necesitas
    };
    this.warehouseService.getAll(filter).subscribe({
      next: (data) => {
        this.warehouses.push(...data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading warehouses', err);
        this.loading = false;
      },
    });
  }

  loadOrders(filter: OrderFilter): void {
    this.loading = true;
    this.orderService.getAll(filter).subscribe({
      next: (data) => {
        this.orders = data;
        this.ordersSubject.next(data); // Actualiza el BehaviorSubject con las órdenes
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.loading = false;
      },
    });
  }

  openModal(order: OrderDto) {
    this.selectedOrderId = order.id;
    this.selectedOrderName = order.name;
  }

  handleClose(data: any) {
    this.selectedOrderId = undefined;
  }

  handleSave(data: any) {
    console.log('Saved data:', data);
    this.orderService
      .addInventory(this.selectedOrderId!, data.products)
      .subscribe({
        next: (data) => {
          console.log('Order created:', data);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error saving order', err);
          this.loading = false;
        },
      });
    this.selectedOrderId = undefined;
  }

  handleActiveItemChange(index: string | number | undefined) {
    const validIndex = typeof index === 'number' ? index : Number(index);
    if (!isNaN(validIndex)) {
      this.activeTab = validIndex;
      this.loadOrders({ categoryId: this.activeTab });
    }
  }

  get columns() {
    switch (this.activeTab) {
      case 0:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'code', label: 'Orden' },
          { key: 'clientFullName', label: 'Cliente' },
          { key: 'storeName', label: 'Tienda' },
          { key: 'clientPhone', label: 'Teléfono' },
          { key: 'clientAddress', label: 'Dirección' },
          { key: 'notes', label: 'Notas' },
          { key: 'deliveryFee', label: 'Flete' },
          { key: 'totalAmount', label: 'Valor total' },
          { key: 'contains', label: 'Contiene' },
          { key: 'city', label: 'Ciudad' },
          { key: 'status', label: 'Estado' },
          { key: 'actions', label: 'Acciones' },
        ];
      case 1:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'storeName', label: 'Tienda' },
          { key: 'clientAddress', label: 'Dirección' },
          { key: 'status', label: 'Estado' },
          { key: 'actions', label: 'Acciones' },
        ];
      case 2:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'clientFullName', label: 'Cliente' },
          { key: 'export', label: 'Exportar' },
          { key: 'status', label: 'Estado' },
        ];
      default:
        return [];
    }
  }
}
