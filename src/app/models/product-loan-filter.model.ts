import { PaginationFilter } from './common/pagination-filter.model';
import { ProductLoanStatus } from './enums/product-loan-status.enum';

export interface ProductLoansFilter extends PaginationFilter {
  id?: number;
  warehouseId?: number;
  status?: ProductLoanStatus;
  startDate?: string;
  endDate?: string;
}   