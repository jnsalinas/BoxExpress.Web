import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-products',
  imports: [CommonModule],
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.scss'
})
export class OrderProductsComponent {
  @Input() orderId!: number;
}
