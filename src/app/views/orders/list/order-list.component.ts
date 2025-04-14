import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { OrderCategoryService } from '../../../services/order-category.service';
import { OrderStatusService } from '../../../services/order-status.service';

import { WarehouseService } from '../../../services/warehouse.service';
import { OrderDto } from '../../../models/order.dto';
import { OrderFilter } from '../../../models/order-filter.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GenericModalComponent } from '../../../views/shared/components/generic-modal/generic-modal.component';

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
import { BehaviorSubject, forkJoin } from 'rxjs';
import { OrderCategoryDto } from '../../../models/order-category.dto';
import { OrderStatusDto } from '../../../models/order-status.dto';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    GenericModalComponent,
  ],
})
export class OrderListComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;

  statusOptions: OrderStatusDto[] = [];
  categoryOptions: OrderCategoryDto[] = [];

  selectedOrderId: number | undefined;
  selectedOrderName: string = '';

  orders: OrderDto[] = [];
  warehouseOptions: WarehouseDto[] = [
    {
      id: 0,
      name: 'Tradicional',
    },
  ];
  loading = false;
  activeTab: number = 0;

  private ordersSubject = new BehaviorSubject<OrderDto[]>([]); // Aquí almacenamos las órdenes
  orders$ = this.ordersSubject.asObservable(); // Observable para los componentes que escuchan cambios

  constructor(
    private orderService: OrderService,
    private warehouseService: WarehouseService,
    private statusOrderService: OrderStatusService,
    private categoryOrderService: OrderCategoryService
  ) {}

  ngOnInit(): void {
    this.loadOrders({ categoryId: this.statusForActiveTab });

    this.loading = true;
    forkJoin({
      warehouses: this.warehouseService.getAll({}),
      statuses: this.statusOrderService.getAll(),
      categories: this.categoryOrderService.getAll(),
    }).subscribe({
      next: (responses) => {
        this.statusOptions = responses.statuses;
        this.categoryOptions = responses.categories;
        this.warehouseOptions.push(...responses.warehouses);
        console.log('Warehouse options:', this.warehouseOptions);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
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

  // openModal(order: OrderDto) {
  //   this.selectedOrderId = order.id;
  //   this.selectedOrderName = order.name;
  // }

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
      this.loadOrders({ categoryId: this.statusForActiveTab });
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
          { key: 'category', label: 'Categoria' },
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
          { key: 'status', label: 'Estado' },
        ];
      default:
        return [];
    }
  }

  get statusForActiveTab(): number {
    return this.activeTab + 1;
  }

  handleStatusChange(event: { orderId: number; statusId: number }) {
    console.log('Status changed:', event);
  }

  handleCategoryChange(event: { orderId: number; categoryId: number }) {
    console.log('Category changed:', event);
  }

  handleWarehouseChange(event: { orderId: number; warehouseId: number }) {
    console.log('Warehouse changed:', event);
    console.log(
      'Warehouse changed for Order ID:',
      event.orderId,
      'with Warehouse ID:',
      event.warehouseId
    );

    let category = "Express";
    if (event.warehouseId == 0) {
      category = "Tradicional";
    }

    this.modal.show({
      title: 'Confirmar Acción',
      body: `¿Estás seguro de que desea pasar la orden ${event.orderId} como ${category}?`,
      ok: () => {
        this.orderService.changeWarehouse(event.orderId, event.warehouseId).subscribe({
          next: (data) => {
            console.log('Warehouse changed successfully:', data);
            this.loadOrders({ categoryId: this.statusForActiveTab });
          },
          error: (err) => {
            console.error('Error changing warehouse', err);
          },
        });
      },
      close: () => {
        console.log('Acción close');
      },
    });
  }
}
