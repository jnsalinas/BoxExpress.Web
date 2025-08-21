import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { OrderCategoryService } from '../../../services/order-category.service';
import { OrderStatusService } from '../../../services/order-status.service';

import { WarehouseService } from '../../../services/warehouse.service';
import { OrderDto } from '../../../models/order.dto';
import { OrderFilter } from '../../../models/order-filter.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GenericModalComponent } from '../../../views/shared/components/generic-modal/generic-modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormLabelDirective, FormControlDirective } from '@coreui/angular';
import { freeSet } from '@coreui/icons';

import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';
import {
  toUtcStartOfDayLocal,
  toUtcEndOfDayLocal,
} from '../../../shared/utils/date-utils';
import { WarehouseFilter } from '../../../models/warehouse-filter.model';
import { WarehouseDto } from '../../../models/warehouse.dto';
import { OrderTableComponent } from '../components/order-table/order-table.component';
import { BehaviorSubject, delay, forkJoin } from 'rxjs';
import { OrderCategoryDto } from '../../../models/order-category.dto';
import { OrderStatusDto } from '../../../models/order-status.dto';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { StoreDto } from '../../../models/store.dto';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { OrderEditModalComponent } from '../components/order-edit-modal/order-edit-modal.component';
import { IconDirective } from '@coreui/icons-angular';
import { GenericPaginationComponent } from '../../../shared/components/generic-pagination/generic-pagination.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { AuthService } from '../../../services/auth.service';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { OrderSummaryDto } from '../../../models/order-summary.dto';
import { BulkUploadModalComponent } from '../components/bulk-upload-modal/bulk-upload-modal.component';
import { UploadOrdersDto } from '../../../models/upload-orders.dto';
import { MessageService } from '../../../services/message.service';
import {
  BulkUploadDataDto,
  BulkUploadResponseDto,
} from '../../../models/bulk-upload-response.dto';

@Component({
  standalone: true,
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    OrderTableComponent,
    FormsModule,
    GenericModalComponent,
    NgSelectModule,
    ReactiveFormsModule,
    LoadingOverlayComponent,
    FormLabelDirective,
    FormControlDirective,
    OrderEditModalComponent,
    IconDirective,
    GenericPaginationComponent,
    HasRoleDirective,
    RouterLink,
    BulkUploadModalComponent,
  ],
})
export class OrderListComponent implements OnInit {
  icons = freeSet;
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  statusOptions: OrderStatusDto[] = [];
  categoryOptions: OrderCategoryDto[] = [];
  filtersForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  selectedOrderId: number | undefined;
  selectedOrderName: string = '';
  orders: OrderDto[] = [];
  orderSummary: OrderSummaryDto[] = [];
  activeTab: number;
  stores: StoreDto[] = [];
  warehouses: WarehouseDto[] = [];
  private ordersSubject = new BehaviorSubject<OrderDto[]>([]); // Aquí almacenamos las órdenes
  orders$ = this.ordersSubject.asObservable(); // Observable para los componentes que escuchan cambios
  orderSelected: OrderDto | null = null;
  pagination: PaginationDto = {};
  currentPage: number = 1;
  showBulkUploadModal: boolean = false;
  bulkUploadResults$ = new BehaviorSubject<BulkUploadDataDto[]>([]);
  @ViewChild(BulkUploadModalComponent)
  bulkUploadModal!: BulkUploadModalComponent;

  constructor(
    private orderService: OrderService,
    private warehouseService: WarehouseService,
    private statusOrderService: OrderStatusService,
    private categoryOrderService: OrderCategoryService,
    private storeService: StoreService,
    private fb: FormBuilder,
    private authService: AuthService,
    private warehouseInventoryService: WarehouseInventoryService,
    private messageService: MessageService
  ) {
    this.activeTab =
      this.authService.hasRoleOrHigher('supervisor') ||
      this.authService.isTienda()
        ? 0
        : 1;
    this.filtersForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      orderId: [null],
      storeId: [null],
      warehouseId: [null],
      scheduledDate: [null],
    });
  }

  ngOnInit(): void {
    this.loadOrders();

    this.isLoading = true;
    forkJoin({
      warehouses: this.warehouseService.getAll({}),
      statuses: this.statusOrderService.getAll(),
      categories: this.categoryOrderService.getAll(),
      stores: this.storeService.getAll(),
    }).subscribe({
      next: (responses) => {
        this.statusOptions = responses.statuses.data;
        this.categoryOptions = responses.categories.data;
        this.stores = responses.stores.data;
        this.warehouses.push(...responses.warehouses.data);
        this.warehouses = responses.warehouses.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      },
    });
  }

  getFilters(): OrderFilter {
    const filters = this.filtersForm.value;
    const payload: OrderFilter = {
      categoryId: this.activeTab,
      startDate: filters.startDate
        ? toUtcStartOfDayLocal(filters.startDate)
        : null,
      endDate: filters.endDate ? toUtcEndOfDayLocal(filters.endDate) : null,
      orderId: filters.orderId ?? null,
      storeId: filters.storeId || null,
      page: this.currentPage,
      warehouseId: filters.warehouseId || null,
      scheduledDate: filters.scheduledDate
        ? toUtcStartOfDayLocal(filters.scheduledDate)
        : null,
      // pageSize: 2
    };
    return payload;
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAll(this.getFilters()).subscribe({
      next: (result) => {
        this.orders = result.data;
        this.ordersSubject.next(result.data); // Actualiza el BehaviorSubject con las órdenes
        this.isLoading = false;
        this.pagination = result.pagination;
        this.loadSummary();
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      },
    });
  }

  loadSummary() {
    this.isLoading = true;
    this.orderService.getSummary(this.getFilters()).subscribe({
      next: (result) => {
        this.orderSummary = result;
        this.isLoading = false;
        console.log('orderSummary', this.orderSummary);
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      },
    });
  }

  handleActiveItemChange(index: string | number | undefined) {
    const validIndex = typeof index === 'number' ? index : Number(index);
    if (!isNaN(validIndex)) {
      this.activeTab = validIndex;
      this.loadOrders();
    }
  }

  get columns() {
    switch (this.activeTab) {
      case 0:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'code', label: 'Orden' },
          { key: 'clientFullName', label: 'Cliente' },
          { key: 'storeName', label: 'Tienda' },
          { key: 'clientPhone', label: 'Teléfono' },
          { key: 'clientAddress', label: 'Dirección' },
          { key: 'clientAddressComplement', label: 'Complemento' },
          { key: 'postalCode', label: 'Código Postal' },
          { key: 'notes', label: 'Notas' },
          { key: 'deliveryFee', label: 'Flete' },
          { key: 'totalAmount', label: 'Valor total' },
          { key: 'contains', label: 'Contiene' },
          { key: 'city', label: 'Ciudad' },
          { key: 'category', label: 'Categoria' },
          { key: 'actions', label: 'Acciones' },
        ];
      case 1:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'code', label: 'Orden' },
          { key: 'clientFullName', label: 'Cliente' },
          { key: 'storeName', label: 'Tienda' }, //todo: solo para admin
          { key: 'clientPhone', label: 'Teléfono' },
          { key: 'clientAddress', label: 'Dirección' },
          { key: 'clientAddressComplement', label: 'Complemento' },
          { key: 'postalCode', label: 'Código Postal' },
          { key: 'notes', label: 'Notas' },
          { key: 'deliveryFee', label: 'Flete' },
          { key: 'totalAmount', label: 'Valor' },
          { key: 'contains', label: 'Contiene' },
          { key: 'city', label: 'Ciudad' },
          { key: 'warehouseName', label: 'Bodega' },
          { key: 'status', label: 'Estado' },
          { key: 'scheduledDate', label: 'Fecha de programación' },
          { key: 'timeSlot', label: 'Fecha de programación' },
          { key: 'actions', label: 'Acciones' },
          { key: 'action-edit', label: 'Editar' },
        ];
      case 2:
        return [
          { key: 'id', label: 'Guia' },
          { key: 'clientFullName', label: 'Cliente' },
          { key: 'status', label: 'Estado' },
        ];
      default:
        return [];
    }
  }

  // get statusForActiveTab(): number {
  //   return this.activeTab;
  // }

  handleStatusChange(event: {
    orderId: number;
    statusId: number;
    previousStatusId: number;
  }) {
    const order = this.orders.find((o) => o.id === event.orderId);
    if (order == null) return;

    const status = this.statusOptions.find(
      (status) => status.id === Number(event.statusId)
    );

    this.modal.show({
      title: 'Cambio de estado',
      body: `¿Estás seguro de que desea pasar la orden ${event.orderId} como ${status?.name}?`,
      ok: () => {
        this.orderService
          .changeStatus(event.orderId, event.statusId)
          .subscribe({
            next: (data) => {
              this.loadOrders();
            },
            error: (err) => {
              console.error('Error changing status', err);
              if (!this.authService.hasRole('bodega')) {
                order.statusId = event.previousStatusId;
              }

              this.modal.show({
                title: 'Error',
                body: `${err.message}`,
                showCancelButton: false,
                okText: 'Ok',
              });
            },
          });
      },
      close: () => {
        console.log('close');
        if (!this.authService.hasRole('bodega')) {
          order.statusId = event.previousStatusId;
        }
      },
    });
  }

  //#region category
  handleWarehouseChange(event: { orderId: number; warehouseId: number }) {
    let category = 'Express';
    if (event.warehouseId == 0) {
      category = 'Tradicional';
    }

    this.modal.show({
      title: 'Cambio de bodega',
      body: `¿Estás seguro de que desea pasar la orden ${event.orderId} como ${category}?`,
      ok: () => {
        this.orderService
          .changeWarehouse(event.orderId, event.warehouseId)
          .subscribe({
            next: (data) => {
              this.loadOrders();
            },
            error: (err) => {
              console.error('Error changing warehouse', err);
              this.modal.show({
                title: 'Error',
                body: `Error al cambiar la bodega:\n ${err.message}`,
                okText: 'Aceptar',
                showCancelButton: false,
                ok: () => {},
                close: () => {},
              });

              this.loadOrders();
            },
          });
      },
      close: () => {
        const order = this.orders.find((order) => order.id === event.orderId);
        if (order) {
          order.warehouseId = null;
        }
      },
    });
  }
  //#endregion

  //#region filters
  onFilter(): void {
    this.loadOrders();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.loadOrders();
  }
  //#endregion

  //#region modal update

  //#region schedule
  handleScheduleOrder(order: OrderDto) {
    this.orderSelected = order;
  }

  onModalScheduleSave(event: any) {
    this.modal.show({
      title: 'Aceptar cambios',
      body: `¿Estás seguro de que desea realizar esta acción?`,
      ok: () => {
        this.isLoading = true;
        if (this.orderSelected)
          this.orderService.schedule(this.orderSelected.id, event).subscribe({
            next: () => {
              this.isLoading = false;
              this.orderSelected = null;
              this.loadOrders();
            },
            error: (error) => {
              console.error('Error schedule:', error);
              this.isLoading = false;
            },
          });
      },
      close: () => {
        console.log('Acción close');
      },
    });
  }

  onModalScheduleClose(event: any) {
    this.orderSelected = null;
  }
  //#endregion

  downloadExcel() {
    this.orderService.export(this.getFilters()).subscribe((response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      const dateTimeString = new Date()
        .toISOString()
        .replace('T', '_')
        .replace(/:/g, '-')
        .substring(0, 16);

      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `Ordenes_${dateTimeString}.xlsx`;
      a.click();
      this.isLoading = false;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('pendiente') || statusLower.includes('pending')) {
      return 'status-pending';
    } else if (
      statusLower.includes('procesando') ||
      statusLower.includes('processing')
    ) {
      return 'status-processing';
    } else if (
      statusLower.includes('enviado') ||
      statusLower.includes('shipped')
    ) {
      return 'status-shipped';
    } else if (
      statusLower.includes('entregado') ||
      statusLower.includes('delivered')
    ) {
      return 'status-delivered';
    } else if (
      statusLower.includes('cancelado') ||
      statusLower.includes('cancelled')
    ) {
      return 'status-cancelled';
    } else {
      return 'status-default';
    }
  }

  // Método para obtener la clase CSS del resumen usando las mismas clases que la tabla
  getStatusClassForSummary(statusName: string): string {
    const statusLower = statusName.toLowerCase();

    if (
      statusLower.includes('sin programar') ||
      statusLower.includes('unscheduled')
    ) {
      return 'bg-sin-programar';
    } else if (
      statusLower.includes('programado') ||
      statusLower.includes('scheduled')
    ) {
      return 'bg-programado';
    } else if (
      statusLower.includes('en ruta') ||
      statusLower.includes('in transit')
    ) {
      return 'bg-en-ruta';
    } else if (
      statusLower.includes('entregado') ||
      statusLower.includes('delivered')
    ) {
      return 'bg-entregado';
    } else if (
      statusLower.includes('cancelado') ||
      statusLower.includes('cancelled')
    ) {
      return 'bg-cancelado';
    } else {
      return 'bg-secondary'; // Color por defecto
    }
  }

  // Método para obtener el icono representativo de cada estado
  getStatusIcon(statusName: string): string {
    const statusLower = statusName.toLowerCase();

    if (
      statusLower.includes('sin programar') ||
      statusLower.includes('unscheduled')
    ) {
      return 'cil-clock';
    } else if (
      statusLower.includes('programado') ||
      statusLower.includes('scheduled')
    ) {
      return 'cil-calendar';
    } else if (
      statusLower.includes('en ruta') ||
      statusLower.includes('in transit')
    ) {
      return 'cil-truck';
    } else if (
      statusLower.includes('entregado') ||
      statusLower.includes('delivered')
    ) {
      return 'cil-task';
    } else if (
      statusLower.includes('cancelado') ||
      statusLower.includes('cancelled')
    ) {
      return 'cil-x';
    } else {
      return 'cil-circle'; // Icono por defecto
    }
  }

  showModalBulkUpload() {
    this.showBulkUploadModal = true;
  }

  onBulkUploadSave(event: any) {
    this.modal.show({
      title: 'Carga masiva',
      body: '¿Estás seguro de que desea cargar las órdenes?',
      ok: () => {
        this.orderService
          .bulkUpload({
            file: event.file,
            storeId: event.storeId,
          } as UploadOrdersDto)
          .subscribe({
            next: (result) => {
              console.log('Resultado de carga masiva:', result);
              this.bulkUploadResults$.next(result);

              // Mostrar resultados de la carga
              if (result.length > 0) {
                const successCount = result.filter(
                  (item) => item.isLoaded
                ).length;
                const errorCount = result.filter(
                  (item) => !item.isLoaded
                ).length;

                if (errorCount > 0) {
                  this.messageService.showWarning(
                    `Carga completada con errores. ${successCount} exitosos, ${errorCount} con errores.`
                  );
                } else {
                  this.messageService.showSuccess(
                    `Carga exitosa. ${successCount} órdenes cargadas correctamente.`
                  );
                }
              } else {
                this.messageService.showSuccess(
                  'Órdenes cargadas correctamente'
                );
              }

              this.loadOrders();
              this.bulkUploadModal.resetSavingState();
            },
            error: (error) => {
              console.error('Error al cargar las órdenes', error);
              this.messageService.showError('Error al cargar las órdenes');
            },
          });
      },
      close: () => {
        this.showBulkUploadModal = false;
      },
    });
  }

  onBulkUploadClose(event: any) {
    this.showBulkUploadModal = false;
  }
}
