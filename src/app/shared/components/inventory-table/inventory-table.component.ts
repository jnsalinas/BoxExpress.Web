import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ProductDto } from '../../../models/product.dto';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss'],
  standalone: true,
  imports: [GenericPaginationComponent, CommonModule],
})
export class InventoryTableComponent {
  @Input() products: ProductDto[] = [];
  @Input() showActions = false;
  @Input() showStore = true;
  @Input() pagination: PaginationDto | null = null;
  @Input() currentPage = 1;
  @Input() actionsTemplate?: TemplateRef<any>;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
