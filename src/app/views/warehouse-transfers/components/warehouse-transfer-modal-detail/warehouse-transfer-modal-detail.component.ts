import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  CardModule,
  FormModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

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
  ],
  templateUrl: './warehouse-transfer-modal-detail.component.html',
  styleUrl: './warehouse-transfer-modal-detail.component.scss',
})
export class WarehouseTransferModalDetailComponent {
  @Input() isVisible!: boolean;
}
