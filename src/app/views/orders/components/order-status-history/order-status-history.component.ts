import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ListGroupDirective,
  ListGroupItemDirective,
} from '@coreui/angular';
import { OrderStatusHistoryDto } from '../../../../models/order-status-history.dto';
import { OrderService } from '../../../../services/order.service';
@Component({
  standalone: true,
  selector: 'app-order-status-history',
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ListGroupDirective,
    ListGroupItemDirective,
  ],
  templateUrl: './order-status-history.component.html',
  styleUrl: './order-status-history.component.scss',
})
export class OrderStatusHistoryComponent implements OnInit {
  @Input() orderId!: number;
  orderStatusHistory: OrderStatusHistoryDto[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.orderService.getOrderStatusHistory(this.orderId).subscribe({
      next: (result) => {
        this.orderStatusHistory = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      },
    });
  }
}
