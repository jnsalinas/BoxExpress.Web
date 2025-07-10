import { Component } from '@angular/core';
import { OrderFormComponent } from '../components/order-form/order-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-create',
  imports: [CommonModule, OrderFormComponent],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent {

}
