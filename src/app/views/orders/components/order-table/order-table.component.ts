import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { OrderStatusName } from '../../../../models/enums/order-status.enum';
import { AuthService } from '../../../../services/auth.service';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';

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
    NgSelectModule,
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
  
  validationsAvailableStatus: { [key in OrderStatusName]: OrderStatusName[] } = {
    [OrderStatusName.Unscheduled]: [OrderStatusName.Scheduled],
    [OrderStatusName.Scheduled]: [OrderStatusName.InTransit],
    [OrderStatusName.InTransit]: [OrderStatusName.Delivered, OrderStatusName.Cancelled],
    [OrderStatusName.Delivered]: [],
    [OrderStatusName.Cancelled]: [OrderStatusName.Delivered, OrderStatusName.Scheduled],
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

  getAvailableStatuses(order: any): any[] {
    const currentStatusName = this.getCurrentStatusName(order) as OrderStatusName;
    const allowedStatusNames = this.validationsAvailableStatus[currentStatusName] || [];
    // Incluye el estado actual como opción deshabilitada
    const currentStatus = this.statusOptions.find(s => s.name === currentStatusName);
    const allowedStatuses = this.statusOptions.filter(status =>
      allowedStatusNames.includes(status.name as OrderStatusName)
    );
    // Devuelve el estado actual (deshabilitado) + los permitidos (habilitados)
    return [
      currentStatus ? { ...currentStatus, disabled: true } : null,
      ...allowedStatuses
    ].filter(Boolean);
  }

  getCurrentStatusName(order: any): string {
    return order.status || this.statusOptions.find(s => s.id === order.statusId)?.name || '';
  }
}
