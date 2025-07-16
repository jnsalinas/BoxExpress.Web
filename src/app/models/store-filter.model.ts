import { PaginationFilter } from './common/pagination-filter.model';

export interface StoreFilter extends PaginationFilter {
  name?: string;
  storeId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}
