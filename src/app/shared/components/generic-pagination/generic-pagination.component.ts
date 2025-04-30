import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
} from '@coreui/angular';
import { PaginationDto } from '../../../models/common/pagination.dto';

@Component({
  selector: 'app-generic-pagination',
  imports: [
    CommonModule,
    PaginationComponent,
    PageLinkDirective,
    PageItemDirective,
  ],
  standalone: true,
  templateUrl: './generic-pagination.component.html',
  styleUrl: './generic-pagination.component.scss',
})
export class GenericPaginationComponent {
  @Input() pagination: PaginationDto | null = null;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    if (!this.pagination || !this.pagination.totalPages) {
      return 1;
    }

    return this.pagination?.totalPages;
  }

  onPageChange(page: number): void {
    if (this.pagination && this.pagination.totalPages) {
      if (page >= 1 && page <= this.pagination?.totalPages) {
        this.pageChange.emit(page);
      }
    }
  }
}
