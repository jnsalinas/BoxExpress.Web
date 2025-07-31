import { Component, OnInit } from '@angular/core';
import { OrderFormComponent } from '../components/order-form/order-form.component';
import { CommonModule } from '@angular/common';
import { CreateOrderDto } from '../../../models/create-order.dto';
import { OrderDto } from '../../../models/order.dto';
import { OrderService } from '../../../services/order.service';
import { MessageService } from '../../../services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, OrderFormComponent, LoadingOverlayComponent],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit {
  isLoading = false;
  isSubmitting = false;
  orderToEdit?: CreateOrderDto;
  orderId?: number;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrderData();
      }
    });
  }

  private loadOrderData(): void {
    if (!this.orderId) return;

    this.isLoading = true;
    this.orderService.getById(this.orderId).subscribe({
      next: (order) => {
        this.orderToEdit = {
          clientFirstName: order.client?.firstName || '',
          clientLastName: order.client?.lastName || '',
          cityId: 1,
          currencyId: 1,
          clientEmail: order.client?.email || '',
          clientPhone: order.client?.phone || '',
          clientAddress: order.clientAddress || '',
          clientAddressComplement: order.clientAddress || '',
          latitude: order.client?.addresses?.[0]?.latitude || undefined,
          longitude: order.client?.addresses?.[0]?.longitude || undefined,
          postalCode: order.client?.addresses?.[0]?.postalCode || undefined,
          storeId: order.storeId || 0,
          deliveryFee: order.deliveryFee || 0,  
          code: order.code || '',
          contains: order.contains || '',
          totalAmount: order.totalAmount || 0,
          notes: order.notes || '',
          orderItems: order.orderItems || [],
        };

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando orden:', error);
        this.messageService.showMessageError('Error cargando la orden');
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
    });
  }

  onFormSubmit(createOrderDto: CreateOrderDto): void {
    if (!this.orderId) return;

    this.isLoading = true;
    this.orderService.updateOrder(this.orderId, createOrderDto).subscribe({
      next: (res) => {
        this.messageService.showSuccess('Orden actualizada correctamente');
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
