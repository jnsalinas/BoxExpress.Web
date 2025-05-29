import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  RowComponent,
  ColComponent,
  TableDirective,
  ButtonDirective,
} from '@coreui/angular';
import { InventoryHoldDto } from '../../../models/inventory-hold.dto';
import { InventoryHoldService } from '../../../services/inventory-hold.service';
import { InventoryHoldStatus } from '../../../models/enums/inventory-hold-status.enum';
import { CommonModule } from '@angular/common';
import { InventoryReturnSolveModalComponent } from '../components/inventory-return-solve-modal/inventory-return-solve-modal.component';
import { InventoryHoldResolutionDto } from '../../../models/inventory-hold-resolution.dto';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { RouterLink } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  standalone: true,
  selector: 'app-inventory-return-list',
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    InventoryReturnSolveModalComponent,
    GenericModalComponent,
    RouterLink,
    LoadingOverlayComponent,
  ],
  templateUrl: './inventory-return-list.component.html',
  styleUrl: './inventory-return-list.component.scss',
})
export class InventoryReturnListComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  pendingReturns: InventoryHoldDto[] = [];
  inventoryHoldResolution: InventoryHoldResolutionDto | null = null;
  isLoading = false;

  constructor(private inventoryHoldService: InventoryHoldService) {}
  ngOnInit(): void {
    this.loadPendingReturns();
  }

  loadPendingReturns(): void {
    this.isLoading = true;
    this.inventoryHoldService
      .getAll({ status: InventoryHoldStatus.PendingReturn })
      .subscribe({
        next: (res) => {
          this.pendingReturns = res.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getTitleModal(): string {
    switch (this.inventoryHoldResolution?.status) {
      case InventoryHoldStatus.NotReturned:
        return 'Devolución no recibida';
      default:
        return 'Aceptar devolución de productos';
    }
  }

  openSolveModal(data: InventoryHoldDto, isAccepted: boolean): void {
    this.inventoryHoldResolution = {
      inventoryHoldId: data.id,
      notes: '',
      status: isAccepted
        ? InventoryHoldStatus.Returned
        : InventoryHoldStatus.NotReturned,
    };
    console.log('Open solve modal for:', data);
  }

  acceptReturn(data: InventoryHoldResolutionDto): void {
    if (this.inventoryHoldResolution !== null) {
      this.inventoryHoldResolution.notes = data.notes;

      debugger;
      this.modal.show({
        title:
          this.inventoryHoldResolution.status == InventoryHoldStatus.Returned
            ? '¿Aceptar devolución?'
            : '¿Aceptar descuento de productos?',
        body: `¿Está seguro de que desea aceptar el proceso ${this.inventoryHoldResolution?.inventoryHoldId}?`,
        ok: () => {
          switch (this.inventoryHoldResolution?.status) {
            case InventoryHoldStatus.Returned:
              this.inventoryHoldService
                .acceptReturn(this.inventoryHoldResolution)
                .subscribe({
                  next: () => {
                    this.loadPendingReturns();
                    this.modal.hide();
                  },
                });
              break;
            case InventoryHoldStatus.NotReturned:
              this.inventoryHoldService
                .rejectReturn(this.inventoryHoldResolution)
                .subscribe({
                  next: () => {
                    this.loadPendingReturns();
                    this.modal.hide();
                  },
                });
              break;
            default:
              console.error('Invalid status');
              break;
          }
          this.inventoryHoldResolution = null;
          this.modal.hide();
        },
        close: () => {},
      });
    }
  }

  cancelReturn(): void {
    this.inventoryHoldResolution = null;
  }
}
