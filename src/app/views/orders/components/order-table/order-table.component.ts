import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';
import { EventEmitter } from '@angular/core';
import { OrderCategoryDto } from '../../../../models/order-category.dto';
import { OrderStatusDto } from '../../../../models/order-status.dto';
import { FormsModule } from '@angular/forms';
import { WarehouseDto } from '../../../../models/warehouse.dto';

@Component({
  standalone: true,
  selector: 'app-order-table',
  imports: [TableDirective, RouterLink, CommonModule, FormsModule],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
})
export class OrderTableComponent {
  @Input() orders: any[] = [];
  @Input() columns: { key: string; label: string; isButton?: boolean }[] = [];
  @Input() statusOptions: OrderStatusDto[] = [];
  @Input() categoryOptions: OrderCategoryDto[] = [];
  @Input() warehouseOptions: WarehouseDto[] = [];
  @Output() statusChanged = new EventEmitter<{
    orderId: number;
    statusId: number;
  }>();
  @Output() warehouseChanged = new EventEmitter<{
    orderId: number;
    warehouseId: number;
  }>();

  statusStyles: Record<string, { color: string; badgeClass: string }> = {
    'sin programar': { color: '#adb5bd', badgeClass: 'bg-secondary' },
    'programado': { color: '#0d6efd', badgeClass: 'bg-primary' },
    'entregado': { color: '#198754', badgeClass: 'bg-success' },
    'cancelado': { color: '#dc3545', badgeClass: 'bg-danger' },
    'cancelado 1': { color: '#6f42c1', badgeClass: 'bg-purple' },
  };

  getStatusBadgeClass(status: string): string {
    return this.statusStyles[status?.toLowerCase()]?.badgeClass || 'bg-light text-dark';
  }

  getStatusColor(status: string): string {
    return this.statusStyles[status?.toLowerCase()]?.color || '#dee2e6';
  }

  onStatusChange(orderId: number, statusId: number) {
    console.log('Status changed:', orderId, statusId);
    this.statusChanged.emit({ orderId, statusId });
  }

  onWarehouseChange(orderId: number, warehouseId: number) {
    this.warehouseChanged.emit({ orderId, warehouseId });

  }

  hasColumn(key: string): boolean {
    return this.columns.some(col => col.key === key);
  }
}
