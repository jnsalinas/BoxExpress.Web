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

  onPageChange(page: any): void {
    if (this.pagination && this.pagination.totalPages) {
      if (page >= 1 && page <= this.pagination?.totalPages) {
        this.pageChange.emit(page);
      }
    }
  }

  get paginationPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      // Mostrar todas si son pocas
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push('...');
      for (
        let i = Math.max(2, current - 2);
        i <= Math.min(total - 1, current + 2);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 3) pages.push('...');
      pages.push(total);
    }
    return pages;
  }
}
