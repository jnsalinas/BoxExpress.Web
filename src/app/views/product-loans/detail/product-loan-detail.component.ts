import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';

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
import { ProductLoanDto } from '../../../models/product-loan.dto';
import { ProductLoanDetailDto } from '../../../models/product-loan-detail.dto';
import { ProductLoanStatus } from '../../../models/enums/product-loan-status.enum';
import { MessageService } from '../../../services/message.service';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { AuthService } from '../../../services/auth.service';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';

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
    GenericModalComponent,
  ],
  templateUrl: './product-loan-detail.component.html',
  styleUrl: './product-loan-detail.component.scss',
})
export class ProductLoanDetailComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  icons = freeSet;
  isLoading: boolean = false;
  loanId: number = 0;
  loan: ProductLoanDto | null = null;
  statusForm: FormGroup = new FormGroup({});

  statusOptions = [
    { value: ProductLoanStatus.Pending, label: 'Pendiente' },
    { value: ProductLoanStatus.InProcess, label: 'En Proceso' },
    {
      value: ProductLoanStatus.CompletedWithIssue,
      label: 'Completado',
    },
    { value: ProductLoanStatus.CompletedOk, label: 'Completado' },
  ];

  // Hacer ProductLoanStatus disponible en el template
  ProductLoanStatus = ProductLoanStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productLoansService: ProductLoansService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public authService: AuthService
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
      status: [null, Validators.required],
    });
  }

  private loadLoanDetail(): void {
    this.isLoading = true;
    this.productLoansService.getById(this.loanId).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.statusForm.patchValue({ status: loan.status });

        if (this.loan?.details) {
          this.loan.details.forEach((detail) => {
            // detail.deliveredQuantity = detail.requestedQuantity;
            detail.isAccepted = false;
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan detail:', error);
        this.messageService.showError(
          'Error al cargar el detalle del préstamo'
        );
        this.isLoading = false;
      },
    });
  }

  updateDetailQuantities(detail: ProductLoanDetailDto, index: number): void {
    if (detail.returnedQuantity! > detail.requestedQuantity!) {
      this.messageService.showError(
        'La cantidad entregada no puede exceder la cantidad solicitada'
      );
      detail.deliveredQuantity = 0;
      detail.returnedQuantity = 0;
      return;
    }

    detail.deliveredQuantity =
      (detail.requestedQuantity ?? 0) - (detail.returnedQuantity ?? 0);
  }

  acceptProduct(detail: ProductLoanDetailDto, index: number): void {
    if (
      (detail.returnedQuantity ?? 0) + (detail.deliveredQuantity ?? 0) !=
      detail.requestedQuantity!
    ) {
      this.messageService.showError(
        'La cantidad devuelta y entregada no coincide con la cantidad solicitada'
      );
      return;
    }
    detail.isAccepted = true;
  }

  rejectProduct(detail: ProductLoanDetailDto, index: number): void {
    detail.deliveredQuantity = 0;
    detail.returnedQuantity = 0;
    detail.isAccepted = false;
  }

  completeLoan(): void {
    if (this.loan) {
      if (this.loan?.details?.some((detail) => detail.isAccepted == false)) {
        this.messageService.showError(
          'No se puede finalizar el préstamo si hay productos no aceptados'
        );
        return;
      }

      this.modal.show({
        title: '¿Estás seguro de que deseas finalizar el préstamo?',
        body: 'Esta acción no se puede deshacer',
        ok: () => {
          this.isLoading = true;
          this.productLoansService.complete(this.loanId, this.loan!).subscribe({
            next: () => {
              this.messageService.showSuccess(
                'Préstamo finalizado correctamente'
              );
              this.loadLoanDetail();
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error completing loan:', error);
              this.messageService.showError('Error al finalizar el préstamo');
              this.isLoading = false;
            },
          });
        },
      });
    }
  }

  getStatusDisplayName(status: ProductLoanStatus | undefined): string {
    switch (status) {
      case ProductLoanStatus.Pending:
        return 'Pendiente';
      case ProductLoanStatus.InProcess:
        return 'En Proceso';
      case ProductLoanStatus.CompletedOk || ProductLoanStatus.CompletedWithIssue:
        return 'Completado';
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
      case ProductLoanStatus.CompletedOk || ProductLoanStatus.CompletedWithIssue:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  // calculateLost(detail: ProductLoanDetailDto): number {
  //   const delivered = detail.deliveredQuantity || 0;
  //   const returned = detail.returnedQuantity || 0;
  //   const pending = this.calculatePendingReturn(detail);
  //   return Math.max(0, delivered - returned - pending);
  // }

  goBack(): void {
    this.router.navigate(['/product-loans']);
  }
}
