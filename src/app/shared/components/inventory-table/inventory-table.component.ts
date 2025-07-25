import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { ProductDto } from '../../../models/product.dto';
import { PaginationDto } from '../../../models/common/pagination.dto';
import { GenericPaginationComponent } from '../generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';
import { freeSet } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../../services/auth.service';

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
  ],
})
export class InventoryTableComponent {
  @Input() products: ProductDto[] = [];
  @Input() showActions = false;
  @Input() showStore = true;
  @Input() pagination: PaginationDto | null = null;
  @Input() currentPage = 1;
  @Input() actionsTemplate?: TemplateRef<any>;
  @Output() pageChange = new EventEmitter<number>();
  @Output() addVariant = new EventEmitter<ProductDto>();
  icons = freeSet;

  constructor(private authService: AuthService) {}

  get isAdmin() {
    return this.authService.hasRole('admin');
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onAddVariant(product: ProductDto) {
    this.addVariant.emit(product);
  }
}
