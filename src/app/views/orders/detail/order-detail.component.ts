import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TabPanelComponent,
  TabsComponent,
  TabsListComponent,
  TabDirective,
  TabsContentComponent,
} from '@coreui/angular';
import { OrderService } from '../../../services/order.service';
import { OrderInfoComponent } from '../components/order-info/order-info.component';
import { OrderStatusHistoryComponent } from '../components/order-status-history/order-status-history.component';
import { OrderCategoryHistoryComponent } from '../components/order-category-history/order-category-history.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { OrderDto } from '../../../models/order.dto';
import { OrderProductsComponent } from '../components/order-products/order-products.component';
import { WalletTransactionListComponent } from '../../wallet-transactions/list/wallet-transaction-list.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TabPanelComponent,
    TabsComponent,
    TabsListComponent,
    TabDirective,
    TabsContentComponent,
    OrderProductsComponent,
    OrderCategoryHistoryComponent,
    LoadingOverlayComponent,
    OrderInfoComponent,
    WalletTransactionListComponent,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  order: OrderDto = { id: 0, name: '' };
  activeTab: number = 0;
  isLoading = false;

  orderForm!: FormGroup;
  orderItems: any[] = [];
  statusHistory: any[] = [];
  categoryHistory: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    if (orderId == 'new') {
      this.order;
    } else {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: number) {
    this.isLoading = true;
    this.orderService.getById(id).subscribe((order) => {
      this.order = order;
      // this.orderForm = this.fb.group({
      //   code: [order.code],
      //   client: [order.clientFullName], //todo era client.name
      //   scheduledDate: [order.scheduledDate],
      //   courierComment: [order.notes], //todo era courierComment
      //   notes: [order.notes],
      // });

      // this.orderItems = order.items;
      // this.statusHistory = order.statusHistory;
      // this.categoryHistory = order.categoryHistory;
      this.isLoading = false;
    });
  }

  handleActiveItemChange(key: string | number | undefined) {
    const parsedKey = typeof key === 'string' ? parseInt(key, 10) : key;
    this.activeTab = parsedKey ?? 0;
  }
}
