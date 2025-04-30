import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ListGroupDirective,
  ListGroupItemDirective,
} from '@coreui/angular';
import { OrderCategoryHistoryDto } from 'src/app/models/order-category-history.dto';
import { OrderService } from 'src/app/services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-category-history',
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
  templateUrl: './order-category-history.component.html',
  styleUrl: './order-category-history.component.scss',
})
export class OrderCategoryHistoryComponent {
  @Input() orderId!: number;
  orderCategoryHistory: OrderCategoryHistoryDto[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.orderService.getOrderCategoryHistory(this.orderId).subscribe({
      next: (result) => {
        this.orderCategoryHistory = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      },
    });
  }
}
