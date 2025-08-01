import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtcDatePipe } from '../../../../shared/pipes/utc-date.pipe';
import { GenericPaginationComponent } from '../../../../shared/components/generic-pagination/generic-pagination.component';
import { LoadingOverlayComponent } from '../../../../shared/components/loading-overlay/loading-overlay.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { IconDirective } from '@coreui/icons-angular';
import { WithdrawalRequestService } from '../../../../services/withdrawal-request.service';
import { PaginationDto } from '../../../../models/common/pagination.dto';
import { WithdrawalRequestDto } from '../../../../models/withdrawal-request.dto';
import {
  WithdrawalRequestStatus,
  WithdrawalRequestStatusText,
} from '../../../../constants/withdrawal-request-status';
import { WithdrawalRequestModalComponent } from '../../components/withdrawal-request-modal/withdrawal-request-modal.component';
import { GenericModalComponent } from '../../../../views/shared/components/generic-modal/generic-modal.component';
import { StoreService } from '../../../../services/store.service';
import { StoreDto } from '../../../../models/store.dto';
import { WithdrawalRequestFilter } from 'src/app/models/withdrawal-request-filter.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../services/auth.service';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';

@Component({
  selector: 'app-withdrawal-request-list',
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    CommonModule,
    UtcDatePipe,
    GenericPaginationComponent,
    LoadingOverlayComponent,
    NgSelectModule,
    WithdrawalRequestModalComponent,
    GenericModalComponent,
    HasRoleDirective,
  ],
  templateUrl: './withdrawal-request-list.component.html',
  styleUrl: './withdrawal-request-list.component.scss',
})
export class WithdrawalRequestListComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  isLoading: boolean = false;
  filtersForm: FormGroup = new FormGroup({});
  pagination: PaginationDto = {};
  withdrawalRequests: WithdrawalRequestDto[] = [];
  isModalVisible = false;
  currentPage: number = 1;
  icons = freeSet;
  withdrawalRequestSelected: WithdrawalRequestDto | null = null;
  storeId: number | null = 1;
  stores: StoreDto[] = [];
  statusOptions = [
    { label: 'Pendiente', value: WithdrawalRequestStatus.Pending },
    { label: 'Aceptada', value: WithdrawalRequestStatus.Accepted },
    { label: 'Rechazada', value: WithdrawalRequestStatus.Rejected }
  ];

  constructor(
    private fb: FormBuilder,
    private withdrawalRequestService: WithdrawalRequestService,
    private storeService: StoreService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.filtersForm = this.fb.group({
      orderId: [''],
      storeId: [null],
      startDate: [''],
      endDate: [''],
      status: [null]
    });
  }

  ngOnInit(): void {
    this.loadWithdrawalRequest();
    this.loadStores();
    this.storeId = this.authService.hasRole('admin')
      ? 1
      : this.authService.getStoreId();
  }

  loadWithdrawalRequest() {
    this.isLoading = true;
    this.withdrawalRequestService.getAll(this.getFilters()).subscribe({
      next: (response) => {
        this.withdrawalRequests = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      },
    });
  }

  loadStores() {
    this.storeService.getAll().subscribe({
      next: (response) => {
        this.stores = response.data || [];
      },
      error: (error) => {
        console.error('Error loading stores:', error);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWithdrawalRequest();
  }

  getStatusLabel(status?: WithdrawalRequestStatus): string {
    return WithdrawalRequestStatusText[status!] ?? 'Desconocido';
  }

  getStatusBadgeClass(status?: WithdrawalRequestStatus): string {
    switch (status) {
      case WithdrawalRequestStatus.Accepted:
        return 'bg-success';
      case WithdrawalRequestStatus.Rejected:
        return 'bg-danger';
      case WithdrawalRequestStatus.Pending:
      default:
        return 'bg-warning';
    }
  }

  resetFilters(): void {
    this.filtersForm.patchValue({
      orderId: '',
      storeId: null,
      startDate: '',
      endDate: '',
      status: null
    });
    this.currentPage = 1;
    this.loadWithdrawalRequest();
  }

  downloadExcel() {}

  getFilters(): WithdrawalRequestFilter {
    const filters = this.filtersForm.value;
    const payload: WithdrawalRequestFilter = {
      page: this.currentPage,
    };
    return payload;
  }

  showModal(withdrawalRequest: WithdrawalRequestDto | null = null) {
    this.withdrawalRequestSelected = withdrawalRequest;
    this.isModalVisible = true;
  }

  handleWithdrawalRequestClose() {
    this.isModalVisible = false;
  }

  handleWithdrawalRequestSave(data: WithdrawalRequestDto) {
    this.isLoading = true;
    const sanitizedData: WithdrawalRequestDto = {
      ...data,
      document: data.document?.toString() ?? '',
      accountNumber: data.accountNumber?.toString() ?? '',
      storeId: data.storeId || null,
    };

    this.modal.show({
      title: 'Creacion de retiro',
      body: `¿Estás seguro de que desea solicitar el retiro?`,
      ok: () => {
        this.withdrawalRequestService.create(sanitizedData).subscribe({
          next: (data) => {
            console.log(data);
            //todo mostrar mensaje de crecion
            this.loadWithdrawalRequest();
            this.isLoading = false;
            this.handleWithdrawalRequestClose();
          },
          error: (err) => {
            this.toastr.error(err);
          },
        });
      },
      close: () => {
        // this.loadWithdrawalRequest();
        this.isLoading = false;
      },
    });
  }

  handleWithdrawalRequestApprove(payload: { id: number; reason: string }) {
    console.log('handleWithdrawalRequestApprove', payload.id);
    this.isLoading = true;
    this.modal.show({
      title: 'Aprobacion de retiro',
      body: `¿Estás seguro de que desea aprobar el retiro?`,
      ok: () => {
        this.withdrawalRequestService
          .approve(payload.id, { reason: payload.reason })
          .subscribe({
            next: (data) => {
              this.loadWithdrawalRequest();
              this.isLoading = false;
              this.handleWithdrawalRequestClose();
            },
            error: (err) => {
              console.error('Error approved withdrawal', err);
              this.isLoading = false;
            },
          });
      },
      close: () => {
        // this.loadWithdrawalRequest();
        this.isLoading = false;
      },
    });
  }

  handleWithdrawalRequestReject(payload: { id: number; reason: string }) {
    console.log(payload);
    console.log('handleWithdrawalRequestReject', payload.id);
    this.isLoading = true;
    this.modal.show({
      title: 'Rechazo de retiro',
      body: `¿Estás seguro de que desea rechazar el retiro?`,
      ok: () => {
        this.withdrawalRequestService
          .reject(payload.id, { reason: payload.reason })
          .subscribe({
            next: (data) => {
              //todo mostrar mensaje de crecion
              console.log('data', data);
              this.loadWithdrawalRequest();
              this.isLoading = false;
              this.handleWithdrawalRequestClose();
            },
            error: (err) => {
              console.error('Error reject withdrawal', err);
              this.handleWithdrawalRequestClose();
            },
          });
      },
      close: () => {
        // this.loadWithdrawalRequest();
        this.isLoading = false;
      },
    });
  }
}
