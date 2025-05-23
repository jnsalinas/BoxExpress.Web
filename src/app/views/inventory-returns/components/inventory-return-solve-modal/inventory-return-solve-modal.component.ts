import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GenericModalComponent } from '../../../../views/shared/components/generic-modal/generic-modal.component';
import { CommonModule } from '@angular/common';
import { FormModule } from '@coreui/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InventoryHoldResolutionDto } from 'src/app/models/inventory-hold-resolution.dto';
import { InventoryHoldStatus } from 'src/app/models/enums/inventory-hold-status.enum';

@Component({
  standalone: true,
  selector: 'app-inventory-return-solve-modal',
  imports: [
    GenericModalComponent,
    CommonModule,
    FormModule,
    ReactiveFormsModule,
  ],
  templateUrl: './inventory-return-solve-modal.component.html',
  styleUrl: './inventory-return-solve-modal.component.scss',
})
export class InventoryReturnSolveModalComponent implements OnInit {
  @ViewChild(GenericModalComponent) modal!: GenericModalComponent;
  @Input() isVisible: boolean = false;
  @Input() inventoryHoldResolution!: InventoryHoldResolutionDto | null;
  @Output() close = new EventEmitter<InventoryHoldResolutionDto>();
  @Output() ok = new EventEmitter<InventoryHoldResolutionDto>();
  form: FormGroup = new FormGroup({});
  @Input() title: string = 'Aceptar devolución';
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onClose() {
    this.close.emit();
  }

  onOk() {
    this.ok.emit(this.form.value);
    this.form.reset();
  }
}
