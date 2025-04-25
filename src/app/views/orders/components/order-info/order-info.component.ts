import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderDto } from 'src/app/models/order.dto';

@Component({
  selector: 'app-order-info',
  imports: [CommonModule],
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.scss',
})
export class OrderInfoComponent {
  @Input() order!: OrderDto;
}
