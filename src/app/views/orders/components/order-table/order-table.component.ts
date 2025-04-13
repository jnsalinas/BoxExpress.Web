import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';

@Component({
  standalone: true,
  selector: 'app-order-table',
  imports: [
    TableDirective,
    RouterLink,
    CommonModule
  ],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
})
export class OrderTableComponent {
  @Input() orders: any[] = [];
  @Input() columns: { key: string; label: string; isButton?: boolean }[] = [];
}
