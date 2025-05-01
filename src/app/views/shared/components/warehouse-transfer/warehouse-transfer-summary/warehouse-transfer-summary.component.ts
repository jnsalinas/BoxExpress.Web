import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective } from '@coreui/angular';
import { WarehouseInventoryTransferDto } from 'src/app/models/warehouse-inventory-transfer.dto';

@Component({
  selector: 'app-warehouse-transfer-summary',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    CommonModule
  ],
  templateUrl: './warehouse-transfer-summary.component.html',
  styleUrl: './warehouse-transfer-summary.component.scss',
})
export class WarehouseTransferSummaryComponent {
  @Input() warehouseInventoryTransfer!: WarehouseInventoryTransferDto;
}
