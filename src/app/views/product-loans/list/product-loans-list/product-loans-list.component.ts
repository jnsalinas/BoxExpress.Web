import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoadingOverlayComponent } from '../../../../shared/components/loading-overlay/loading-overlay.component';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal.component';
import { GenericPaginationComponent } from '../../../../shared/components/generic-pagination/generic-pagination.component';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { ProductLoansService } from '../../../../services/product-loans.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { ProductLoansDto } from '../../../../models/product-loan.dto';
import { ProductLoansFilter } from '../../../../models/product-loan-filter.model';
import { WarehouseDto } from '../../../../models/warehouse.dto';
import { PaginationDto } from '../../../../models/common/pagination.dto';
import { ProductLoanStatus } from '../../../../models/enums/product-loan-status.enum';
import { MessageService } from '../../../../services/message.service';

interface ProductLoanSummaryDto {
  statusName: string;
  count: number;
}

@Component({
  selector: 'app-product-loans-list',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NgSelectModule,
    ReactiveFormsModule,
    LoadingOverlayComponent,
    GenericModalComponent,
    GenericPaginationComponent,
    HasRoleDirective,
    RouterLink,
  ],
  templateUrl: './product-loans-list.component.html',
  styleUrl: './product-loans-list.component.scss'
})
export class ProductLoansListComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  
  isLoading: boolean = false;
  productLoans: ProductLoansDto[] = [];
  warehouseOptions: WarehouseDto[] = [];
  statusOptions: { id: number; name: string }[] = [];
  filtersForm: FormGroup = new FormGroup({});
  pagination: PaginationDto = {};
  currentPage: number = 1;
  productLoanSummary: ProductLoanSummaryDto[] = [];

  constructor(
    private productLoansService: ProductLoansService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.initializeForm();
    this.initializeStatusOptions();
  }

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadProductLoans();
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      warehouseId: [null],
      startDate: [null],
      endDate: [null],
      status: [null],
    });
  }

  private initializeStatusOptions(): void {
    this.statusOptions = [
      { id: ProductLoanStatus.Pending, name: 'Pendiente' },
      { id: ProductLoanStatus.InProcess, name: 'En Proceso' },
      { id: ProductLoanStatus.CompletedWithIssue, name: 'Completado con Problemas' },
      { id: ProductLoanStatus.CompletedOk, name: 'Completado OK' },
    ];
  }

  private loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (response) => {
        this.warehouseOptions = response.data || [];
      },
      error: (error) => {
        console.error('Error cargando bodegas:', error);
        this.messageService.showError('Error al cargar las bodegas');
      }
    });
  }

  private loadProductLoans(): void {
    this.isLoading = true;
    const filters = this.getFilters();
    
    this.productLoansService.getAll(filters).subscribe({
      next: (response) => {
        this.productLoans = response.data || [];
        this.pagination = response.pagination || {};
        this.loadSummary();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando préstamos:', error);
        this.messageService.showError('Error al cargar los préstamos');
        this.isLoading = false;
      }
    });
  }

  private getFilters(): ProductLoansFilter {
    const formValue = this.filtersForm.value;
    return {
      page: this.currentPage,
      pageSize: 10,
      warehouseId: formValue.warehouseId,
      status: formValue.status,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };
  }

  private loadSummary(): void {
    // Simular resumen de estados - en producción esto vendría del backend
    const statusCounts = this.productLoans.reduce((acc, loan) => {
      const statusName = this.getStatusDisplayName(loan.status);
      acc[statusName] = (acc[statusName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.productLoanSummary = Object.entries(statusCounts).map(([statusName, count]) => ({
      statusName,
      count
    }));
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadProductLoans();
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.currentPage = 1;
    this.loadProductLoans();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProductLoans();
  }

  viewDetail(loan: ProductLoansDto): void {
    // Navegar al detalle del préstamo
    // this.router.navigate(['/product-loans', loan.id]);
    this.messageService.showInfo('Funcionalidad de detalle en desarrollo');
  }

  downloadExcel(): void {
    this.messageService.showInfo('Funcionalidad de exportación en desarrollo');
  }

  getStatusDisplayName(status: ProductLoanStatus | undefined): string {
    switch (status) {
      case ProductLoanStatus.Pending:
        return 'Pendiente';
      case ProductLoanStatus.InProcess:
        return 'En Proceso';
      case ProductLoanStatus.CompletedWithIssue:
        return 'Completado con Problemas';
      case ProductLoanStatus.CompletedOk:
        return 'Completado OK';
      default:
        return 'Desconocido';
    }
  }

  getStatusBadgeClass(status: ProductLoanStatus | undefined): string {
    switch (status) {
      case ProductLoanStatus.Pending:
        return 'bg-warning';
      case ProductLoanStatus.InProcess:
        return 'bg-info';
      case ProductLoanStatus.CompletedWithIssue:
        return 'bg-danger';
      case ProductLoanStatus.CompletedOk:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getStatusClass(statusName: string): string {
    switch (statusName) {
      case 'Pendiente':
        return 'status-pending';
      case 'En Proceso':
        return 'status-in-process';
      case 'Completado con Problemas':
        return 'status-completed-with-issue';
      case 'Completado OK':
        return 'status-completed-ok';
      default:
        return 'status-default';
    }
  }
}
