import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  ButtonModule,
  CardModule,
  FormModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  ThemeDirective,
  RowComponent,
  ColComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { WarehouseTransferStatus } from '../../../../constants/warehouse-transfer-status';
import { WarehouseInventoryTransferDto } from '../../../..//models/warehouse-inventory-transfer.dto';
import { WarehouseTransferSummaryComponent } from '../../../shared/components/warehouse-transfer/warehouse-transfer-summary/warehouse-transfer-summary.component';
import { UtcDatePipe } from '../../../../shared/pipes/utc-date.pipe';

@Component({
  selector: 'app-warehouse-transfer-modal-detail',
  imports: [
    CommonModule,
    ModalModule,
    ButtonModule,
    FormModule,
    CardModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ReactiveFormsModule,
    IconDirective,
    WarehouseTransferSummaryComponent,
    ButtonDirective,
    ThemeDirective,
    ColComponent,
    RowComponent,
    UtcDatePipe
  ],
  templateUrl: './warehouse-transfer-modal-detail.component.html',
  styleUrl: './warehouse-transfer-modal-detail.component.scss',
})
export class WarehouseTransferModalDetailComponent {
  @Input() warehouseInventoryTransfer!: WarehouseInventoryTransferDto;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();

  isPending() {
    return (
      this.warehouseInventoryTransfer.status == WarehouseTransferStatus.Pending
    );
  }

  close() {
    this.onClose.emit();
  }

  save() {
    this.onSave.emit();
  }

  reject() {
    this.onReject.emit();
  }
}
