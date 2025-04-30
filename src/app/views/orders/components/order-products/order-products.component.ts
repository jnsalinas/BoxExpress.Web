import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
} from '@coreui/angular';
import { OrderItemDto } from 'src/app/models/order-item.dto';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-products',
  imports: [
    CommonModule,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
  ],
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.scss',
})
export class OrderProductsComponent implements OnInit {
  @Input() orderId!: number;
  products: OrderItemDto[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.orderService.getProducts(this.orderId).subscribe({
      next: (result) => {
        this.products = result;
      },
    });
  }
}
