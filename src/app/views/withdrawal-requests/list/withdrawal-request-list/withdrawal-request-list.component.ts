import { Component, Input, OnInit } from '@angular/core';
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
import { NgSelectModule } from '@ng-select/ng-select';
import { IconDirective } from '@coreui/icons-angular';
import { WithdrawalRequestService } from '../../../../services/withdrawal-request.service';
import { PaginationDto } from '../../../../models/common/pagination.dto';
import { WithdrawalRequestDto } from '../../../../models/withdrawal-request.dto';
import {
  WithdrawalRequestStatus,
  WithdrawalRequestStatusText,
} from '../../../../constants/withdrawal-request-status';
import { WithdrawalRequestModalComponent } from '../../components/withdrawal-request-modal/withdrawal-request-modal.component';

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
  ],
  templateUrl: './withdrawal-request-list.component.html',
  styleUrl: './withdrawal-request-list.component.scss',
})
export class WithdrawalRequestListComponent implements OnInit {
  isLoading: boolean = false;
  filtersForm: FormGroup = new FormGroup({});
  pagination: PaginationDto = {};
  withdrawalRequests: WithdrawalRequestDto[] = [];
  isModalVisible = false;
  availableBalance = 1500000; // puedes obtenerlo del backend
  currentPage: number = 1;
  icons = freeSet;

  constructor(
    private fb: FormBuilder,
    private WithdrawalRequestService: WithdrawalRequestService
  ) {}

  ngOnInit(): void {
    // this.filtersForm = this.fb.group({
    //   startDate: [null],
    //   endDate: [null],
    //   orderId: [this.orderId ?? null],
    //   storeId: [null],
    // });
    this.loadWithdrawalRequest();
  }

  loadWithdrawalRequest() {
    this.isLoading = true;
    this.isLoading = true;
    this.WithdrawalRequestService.getAll(this.getFilters()).subscribe({
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

  onPageChange(event: any){

  }

  getStatusLabel(status?: WithdrawalRequestStatus): string {
    return WithdrawalRequestStatusText[status!] ?? 'Desconocido';
  }

  downloadExcel() {}

  getFilters() {
    return {};
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  handleWithdrawal(data: any) {
    console.log('Retiro enviado', data);
    // TODO: Lógica para enviar la solicitud al backend
    this.closeModal();
  }

}
