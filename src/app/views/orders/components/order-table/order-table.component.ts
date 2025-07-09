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
import { HasRoleDirective } from 'src/app/shared/directives/has-role.directive';
import { OrderStatusName } from '../../../../models/enums/order-status.enum';
import { AuthService } from 'src/app/services/auth.service';
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
    ButtonModule,
    HasRoleDirective,
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
  
  validationsAvailableStatus = {
    Delivered: [], // No puede pasar a ningún otro estado desde Delivered
    Scheduled: ['Delivered', 'InTransit'],
    // Puedes agregar más:
    InTransit: ['Delivered'],
    Cancelled: [],
  };

  constructor(public authService: AuthService) {}

  getStatusDelivered(): number {
    return this.statusOptions.find((x) => x.name == OrderStatusName.Delivered)!
      .id!;
  }

  getStatusOnTheWay(): number {
    return this.statusOptions.find((x) => x.name == OrderStatusName.InTransit)!
      .id!;
  }

  getStatusScheduled(): number {
    return this.statusOptions.find((x) => x.name == OrderStatusName.Scheduled)!
      .id!;
  }

   getStatusUnscheduled(): number {
    return this.statusOptions.find((x) => x.name == OrderStatusName.Unscheduled)!
      .id!;
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
