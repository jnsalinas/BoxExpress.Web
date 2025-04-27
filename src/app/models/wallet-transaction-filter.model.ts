import { PaginationFilter } from './common/pagination-filter.model';

export interface WalletTransactionFilter extends PaginationFilter {
  orderId?: number;
  storeId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}
