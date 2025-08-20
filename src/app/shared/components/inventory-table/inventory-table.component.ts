import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ProductDto } from '../../../models/product.dto';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';
import { freeSet } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../../services/auth.service';
import { ProductVariantDto } from '../../../models/product-variant.dto';
import { WarehouseInventoryItemEditModalComponent } from '../../../views/warehouse-transfers/components/warehouse-inventory-item-edit-modal/warehouse-inventory-item-edit-modal.component';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { WarehouseInventoryService } from '../../../services/warehouse-inventory.service';
import { MessageService } from '../../../services/message.service';
import { GenericModalComponent } from '../../../views/shared/components/generic-modal/generic-modal.component';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss'],
  standalone: true,
  imports: [
    GenericPaginationComponent,
    CommonModule,
    IconDirective,
    HasRoleDirective,
    RouterLink,
    RouterLinkWithHref,
    GenericModalComponent,
    WarehouseInventoryItemEditModalComponent,
  ],
})
export class InventoryTableComponent {
  @Input() products: ProductDto[] = [];
  @Input() showActions = false;
  @Input() showStore = true;
  @Input() pagination: PaginationDto | null = null;
  @Input() currentPage = 1;
  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() warehouseInventoryId: number | null = null;

  @Output() pageChange = new EventEmitter<number>();
  @Output() addVariant = new EventEmitter<ProductDto>();
  @Output() refreshData = new EventEmitter<void>();

  icons = freeSet;
  @ViewChild(WarehouseInventoryItemEditModalComponent)
  inventoryItemModal!: WarehouseInventoryItemEditModalComponent;
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;

  constructor(
    public authService: AuthService,
    private warehouseInventoryService: WarehouseInventoryService,
    private messageService: MessageService
  ) {}

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onAddVariant(product: ProductDto) {
    this.addVariant.emit(product);
  }

  openInventoryItemModal(variant: ProductVariantDto) {
    this.warehouseInventoryId = variant.warehouseInventoryId ?? null;
  }

  handleInventoryItemSave(data: any) {
    console.log('Saved data:', data);
    this.modal.show({
      title: 'Actualizar inventario',
      body: `¿Estás seguro de que desea actualizar el inventario?`,
      ok: () => {
        if (this.warehouseInventoryId != null) {
          console.log('Saved data:', data);
          this.warehouseInventoryService
            .update(this.warehouseInventoryId, data)
            .subscribe({
              next: (data) => {
                this.handleInventoryItemClose();
                this.refreshData.emit();
                this.warehouseInventoryId = null;
                // Resetear el estado de guardado en el modal
                if (this.inventoryItemModal) {
                  this.inventoryItemModal.resetSavingState();
                }
                this.messageService.showSuccess('Inventario actualizado');
              },
              error: (err) => {
                console.error('Error isLoading warehouses', err);
                this.handleInventoryItemClose();
                // Resetear el estado de guardado en el modal
                if (this.inventoryItemModal) {
                  this.inventoryItemModal.resetSavingState();
                }
                this.messageService.showMessageError(err);
              },
            });
        } else {
          this.handleInventoryItemClose();
        }
      },
      close: () => {
        // Resetear el estado de guardado si se cancela
        if (this.inventoryItemModal) {
          this.inventoryItemModal.resetSavingState();
        }
      },
    });
  }

  handleInventoryItemClose() {
    this.warehouseInventoryId = null;
    // Resetear el estado de guardado en el modal
    if (this.inventoryItemModal) {
      this.inventoryItemModal.resetSavingState();
    }
  }
}
