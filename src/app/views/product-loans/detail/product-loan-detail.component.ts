import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  ButtonGroupComponent,
  BadgeComponent,
  RowComponent,
  ColComponent,
  InputGroupComponent,
  InputGroupTextDirective,
} from '@coreui/angular';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { ProductLoansService } from '../../../services/product-loans.service';
import { ProductLoansDto } from '../../../models/product-loan.dto';
import { ProductLoanDetailDto } from '../../../models/product-loan-detail.dto';
import { ProductLoanStatus } from '../../../models/enums/product-loan-status.enum';
import { MessageService } from '../../../services/message.service';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-product-loan-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    ButtonGroupComponent,
    BadgeComponent,
    RowComponent,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ReactiveFormsModule,
    FormsModule,
    LoadingOverlayComponent,
    HasRoleDirective,
    IconModule,
    IconDirective,
  ],
  templateUrl: './product-loan-detail.component.html',
  styleUrl: './product-loan-detail.component.scss'
})
export class ProductLoanDetailComponent implements OnInit {
  icons = freeSet;
  isLoading: boolean = false;
  loanId: number = 0;
  loan: ProductLoansDto | null = null;
  statusForm: FormGroup = new FormGroup({});

  statusOptions = [
    { value: ProductLoanStatus.Pending, label: 'Pendiente' },
    { value: ProductLoanStatus.InProcess, label: 'En Proceso' },
    { value: ProductLoanStatus.CompletedWithIssue, label: 'Completado con Problemas' },
    { value: ProductLoanStatus.CompletedOk, label: 'Completado OK' },
  ];

  // Hacer ProductLoanStatus disponible en el template
  ProductLoanStatus = ProductLoanStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productLoansService: ProductLoansService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.loanId) {
      this.loadLoanDetail();
    }
  }

  private initializeForms(): void {
    this.statusForm = this.fb.group({
      status: [null, Validators.required]
    });
  }

  private loadLoanDetail(): void {
    this.isLoading = true;
    this.productLoansService.getById(this.loanId).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.statusForm.patchValue({ status: loan.status });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan detail:', error);
        this.messageService.showError('Error al cargar el detalle del préstamo');
        this.isLoading = false;
      }
    });
  }

  updateStatus(): void {
    if (this.statusForm.valid && this.loan) {
      const newStatus = this.statusForm.value.status;
      this.isLoading = true;
      
      this.productLoansService.updateStatus(this.loanId, newStatus).subscribe({
        next: () => {
          this.messageService.showSuccess('Estado actualizado correctamente');
          this.loadLoanDetail(); // Recargar datos
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.messageService.showError('Error al actualizar el estado');
          this.isLoading = false;
        }
      });
    }
  }

  updateDetailQuantities(detail: ProductLoanDetailDto, index: number): void {
    // Validar que las cantidades no excedan lo solicitado
    if (detail.deliveredQuantity! > detail.requestedQuantity!) {
      this.messageService.showError('La cantidad entregada no puede exceder la cantidad solicitada');
      detail.deliveredQuantity = detail.requestedQuantity;
      return;
    }

    if (detail.returnedQuantity! > detail.deliveredQuantity!) {
      this.messageService.showError('La cantidad devuelta no puede exceder la cantidad entregada');
      detail.returnedQuantity = detail.deliveredQuantity;
      return;
    }

    this.isLoading = true;
    this.productLoansService.updateDetailQuantities(
      this.loanId,
      detail.id!,
      detail.deliveredQuantity || 0,
      detail.returnedQuantity || 0
    ).subscribe({
      next: () => {
        this.messageService.showSuccess('Cantidades actualizadas correctamente');
        this.loadLoanDetail(); // Recargar datos
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating quantities:', error);
        this.messageService.showError('Error al actualizar las cantidades');
        this.isLoading = false;
      }
    });
  }

  acceptProduct(detail: ProductLoanDetailDto, index: number): void {
    // Marcar como entregado completamente
    detail.deliveredQuantity = detail.requestedQuantity;
    detail.returnedQuantity = 0; // Sin devoluciones por defecto
    
    this.updateDetailQuantities(detail, index);
    this.messageService.showInfo('Producto aceptado - Cantidad entregada establecida');
  }

  rejectProduct(detail: ProductLoanDetailDto, index: number): void {
    // Marcar como no entregado
    detail.deliveredQuantity = 0;
    detail.returnedQuantity = 0;
    
    this.updateDetailQuantities(detail, index);
    this.messageService.showInfo('Producto rechazado - Sin entregas');
  }

  completeLoan(): void {
    if (this.loan) {
      this.isLoading = true;
      this.productLoansService.completeLoan(this.loanId).subscribe({
        next: () => {
          this.messageService.showSuccess('Préstamo finalizado correctamente');
          this.loadLoanDetail(); // Recargar datos
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error completing loan:', error);
          this.messageService.showError('Error al finalizar el préstamo');
          this.isLoading = false;
        }
      });
    }
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

  calculatePendingReturn(detail: ProductLoanDetailDto): number {
    const delivered = detail.deliveredQuantity || 0;
    const returned = detail.returnedQuantity || 0;
    return Math.max(0, delivered - returned);
  }

  calculateLost(detail: ProductLoanDetailDto): number {
    const delivered = detail.deliveredQuantity || 0;
    const returned = detail.returnedQuantity || 0;
    const pending = this.calculatePendingReturn(detail);
    return Math.max(0, delivered - returned - pending);
  }

  goBack(): void {
    this.router.navigate(['/product-loans']);
  }
} 