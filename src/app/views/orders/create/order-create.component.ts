import { Component } from '@angular/core';
import { OrderFormComponent } from '../components/order-form/order-form.component';
import { CommonModule } from '@angular/common';
import { CreateOrderDto } from '../../../models/create-order.dto';
import { OrderService } from '../../../services/order.service';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-order-create',
  imports: [CommonModule, OrderFormComponent, LoadingOverlayComponent],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent {
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onFormSubmit(createOrderDto: CreateOrderDto): void {
    this.isLoading = true;
    
    this.orderService.createOrder(createOrderDto).subscribe({
      next: (res) => {
        this.messageService.showSuccess('Orden creada correctamente');
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.log('error', error);
        this.messageService.showMessageError(error);
        this.isLoading = false;
      },
    });
  }
}
