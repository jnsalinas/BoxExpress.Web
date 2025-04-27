import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { OrderDto } from '../../../../models/order.dto';
import { OrderStatusHistoryComponent } from '../order-status-history/order-status-history.component';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
} from '@coreui/angular';
import { OrderStatusService } from '../../../../services/order-status.service';
import { OrderStatusDto } from '../../../../models/order-status.dto';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TimeSlotDto } from 'src/app/models/time-slot.dto';
import { TimeSlotService } from 'src/app/services/time-slot.service';
import { forkJoin } from 'rxjs';
import { StoreService } from '../../../../services/store.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { StoreDto } from 'src/app/models/store.dto';
import { formatDateToInput } from '../../../../shared/utils/date-utils';
import { OrderCategoryService } from '../../../../services/order-category.service';
import { OrderCategoryDto } from '../../../../models/order-category.dto';
import { WarehouseDto } from '../../../../models/warehouse.dto';
@Component({
  standalone: true,
  selector: 'app-order-info',
  imports: [
    CommonModule,
    OrderStatusHistoryComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    NgSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.scss',
})
export class OrderInfoComponent implements OnInit, OnChanges {
  isLoading: boolean = false;
  form!: FormGroup;
  statusOptions: OrderStatusDto[] = [];
  timeSlotOptions: TimeSlotDto[] = [];
  storeOptions: StoreDto[] = [];
  cateogryOptions: OrderCategoryDto[] = [];
  warehouseOptions: WarehouseDto[] = [];

  @Input() order!: OrderDto;

  constructor(
    private orderStatusService: OrderStatusService,
    private fb: FormBuilder,
    private timeSlotService: TimeSlotService,
    private storeService: StoreService,
    private orderCategoryService: OrderCategoryService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && changes['order'].currentValue) {
      this.buildForm();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      storeName: [{ value: this.order.storeName, disabled: true }],
      clientFullName: [{ value: this.order.clientFullName, disabled: true }],
      category: [{ value: this.order.category, disabled: true }],
      statusId: [this.order.statusId, Validators.required],
      categoryId: [this.order.categoryId, Validators.required],
      warehouseId: [this.order.warehouseId, Validators.required],
      // Otros campos importantes:
      contains: [{ value: this.order.contains, disabled: true }],
      deliveryDate: [
        { value: formatDateToInput(this.order.deliveryDate), disabled: true },
      ],
      scheduledDate: [
        { value: formatDateToInput(this.order.scheduledDate), disabled: true },
      ],
      rescheduleDate: [
        { value: formatDateToInput(this.order.rescheduleDate), disabled: true },
      ],
      clientAddress: [{ value: this.order.clientAddress, disabled: true }],
      clientDocument: [{ value: this.order.clientDocument, disabled: true }],
      clientPhone: [{ value: this.order.clientPhone, disabled: true }],
      totalAmount: [{ value: this.order.totalAmount, disabled: true }],
      deliveryFee: [{ value: this.order.deliveryFee, disabled: true }],
      notes: [{ value: this.order.notes, disabled: true }],
      currencyCode: [{ value: this.order.currencyCode, disabled: true }],
      timeSlotId: [this.order.timeSlotId ?? null],
      storeId: [this.order.storeId ?? null],
    });
  }

  loadOptions() {
    this.isLoading = true;

    forkJoin({
      timeSlots: this.timeSlotService.getAll({}),
      statuses: this.orderStatusService.getAll(),
      stores: this.storeService.getAll(),
      categories: this.orderCategoryService.getAll(),
      warehouses: this.warehouseService.getAll(),
    }).subscribe({
      next: (responses) => {
        this.timeSlotOptions = responses.timeSlots.data;
        this.statusOptions = responses.statuses.data;
        this.storeOptions = responses.stores.data;
        this.cateogryOptions = responses.categories.data;
        this.warehouseOptions = responses.warehouses.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      },
    });

    // forkJoin()
    // this.orderStatusService.getAll().subscribe({
    //   next: (result) => {
    //     this.statusOptions = result.data;
    //   },
    // });

    // this.timeSlotService.getAll().subscribe({
    //   next: (result) => {
    //     this.timeSlotOptions = result.data;
    //   },
    // });
  }
}
