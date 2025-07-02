import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  SpinnerComponent,
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

@Component({
  selector: 'app-withdrawal-request-list',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ReactiveFormsModule,
    CommonModule,
    UtcDatePipe,
    GenericPaginationComponent,
    LoadingOverlayComponent,
    NgSelectModule,
    IconDirective,
    WithdrawalRequestModalComponent,
    GenericModalComponent,
    NgSelectModule,
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

  constructor(
    private fb: FormBuilder,
    private withdrawalRequestService: WithdrawalRequestService
  ) {}

  ngOnInit(): void {
    this.loadWithdrawalRequest();
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWithdrawalRequest();
  }

  getStatusLabel(status?: WithdrawalRequestStatus): string {
    return WithdrawalRequestStatusText[status!] ?? 'Desconocido';
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
    this.modal.show({
      title: 'Creacion de retiro',
      body: `¿Estás seguro de que desea solicitar el retiro?`,
      ok: () => {
        this.withdrawalRequestService.create(data).subscribe({
          next: (data) => {
            //todo mostrar mensaje de crecion
            this.loadWithdrawalRequest();
            this.isLoading = false;
            this.handleWithdrawalRequestClose();
          },
          error: (err) => {
            console.error('Error changing withdrawall', err);
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
              //todo mostrar mensaje de crecion
              console.log('data', data);
              this.loadWithdrawalRequest();
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error approved withdrawal', err);
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
            },
            error: (err) => {
              console.error('Error reject withdrawal', err);
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
