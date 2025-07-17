import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { OrderDto } from '../../../../models/order.dto';
import {
  FormBuilder,
  FormControlDirective,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
} from '@coreui/angular';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { TimeSlotDto } from '../../../../models/time-slot.dto';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderStatusDto } from '../../../../models/order-status.dto';

@Component({
  standalone: true,
  selector: 'app-order-edit-modal',
  imports: [
    ModalModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    NgSelectModule,
    ReactiveFormsModule,
    // FormControlDirective
  ],
  templateUrl: './order-edit-modal.component.html',
  styleUrl: './order-edit-modal.component.scss',
})
export class OrderEditModalComponent implements OnInit {
  isLoading = false;
  @Input() isVisible = false;
  @Input() order!: OrderDto;
  @Input() statusOptions!: OrderStatusDto[];
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  today!: string;
  form!: FormGroup;
  timeSlotOptions: TimeSlotDto[] = [];

  constructor(
    private fb: FormBuilder,
    private timeSlotService: TimeSlotService
  ) {}

  ngOnInit(): void {
    console.log(this.order.scheduledDate);
    this.form = this.fb.group({
      // statusId: [this.order.statusId],
      scheduledDate: [this.order.scheduledDate?.toString().split('T')[0]],
      timeSlotId: [this.order.timeSlotId],
    });

    this.loadTimeSlots();
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  loadTimeSlots() {
    this.isLoading = true;
    this.timeSlotService.getAll().subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.timeSlotOptions = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  save(): void {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
      // this.resetForm();
    } else {
      console.log('Formulario inválido:', this.form.value);
    }
  }

  close(): void {
    console.log('Modal closed');
    // this.resetForm();
    this.onClose.emit();
  }
}
