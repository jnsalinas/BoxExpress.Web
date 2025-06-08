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
  ButtonDirective,
  ButtonModule,
} from '@coreui/angular';
import { EventEmitter } from '@angular/core';
import { OrderCategoryDto } from '../../../../models/order-category.dto';
import { OrderStatusDto } from '../../../../models/order-status.dto';
import { FormsModule } from '@angular/forms';
import { WarehouseDto } from '../../../../models/warehouse.dto';
import { OrderDto } from '../../../../models/order.dto';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  standalone: true,
  selector: 'app-order-table',
  imports: [
    TableDirective,
    RouterLink,
    CommonModule,
    FormsModule,
    IconDirective,
    ButtonDirective,
    ButtonModule
  ],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
})
export class OrderTableComponent {
  icons = freeSet;
  @Input() orders: any[] = [];
  @Input() columns: { key: string; label: string; isButton?: boolean }[] = [];
  @Input() statusOptions: OrderStatusDto[] = [];
  @Input() categoryOptions: OrderCategoryDto[] = [];
  @Input() warehouseOptions: WarehouseDto[] = [];
  @Output() statusChanged = new EventEmitter<{
    orderId: number;
    statusId: number;
    previousStatusId: number;
  }>();
  @Output() warehouseChanged = new EventEmitter<{
    orderId: number;
    warehouseId: number;
  }>();
  @Output() scheduleOrder = new EventEmitter<OrderDto>();
  previousStatusId: number = 0;

  // statusStyles: Record<string, { color: string; badgeClass: string }> = {
  //   'sin programar': { color: '#adb5bd', badgeClass: 'bg-secondary' },
  //   'en ruta': { color: '#0dcaf0', badgeClass: 'bg-info' }, // ← sugerido
  //   programado: { color: '#0d6efd', badgeClass: 'bg-primary' },
  //   entregado: { color: '#198754', badgeClass: 'bg-success' },
  //   cancelado: { color: '#dc3545', badgeClass: 'bg-danger' },
  //   'cancelado 1': { color: '#6f42c1', badgeClass: 'bg-purple' },
  // };

  // getStatusBadgeClass(status: string): string {
  //   return (
  //     this.statusStyles[status?.toLowerCase()]?.badgeClass ||
  //     'bg-light text-dark'
  //   );
  // }

  getStatusOnTheWay(): number  {
    return this.statusOptions.find((x) => x.name.toLowerCase() == 'en ruta')!.id!;
  }

  // getStatusColor(status: string): string {
  //   return this.statusStyles[status?.toLowerCase()]?.color || '#dee2e6';
  // }

  onStatusChange(orderId: number, statusId: number) {
    const previousStatusId = this.previousStatusId;
    this.statusChanged.emit({ orderId, statusId, previousStatusId });
  }

  onWarehouseChange(orderId: number, warehouseId: number) {
    this.warehouseChanged.emit({ orderId, warehouseId });
  }

  onScheduleOrder(order: OrderDto) {
    this.scheduleOrder.emit(order);
  }

  hasColumn(key: string): boolean {
    return this.columns.some((col) => col.key === key);
  }

  getOrderContainsText(order: OrderDto): string {
    if (order.orderItems?.length) {
      return order.orderItems
        .map(
          (item) =>
            (item.productName ?? '') +
            ' ' +
            (item.productVariantName ?? '') +
            ' ' +
            (item.quantity ?? '')
        )
        .join('\n');
    }
    return order.contains || '';
  }

  getStatusClass(status: string): string {
    return 'bg-' + status.toLowerCase().replace(/ /g, '-');
  }
}
