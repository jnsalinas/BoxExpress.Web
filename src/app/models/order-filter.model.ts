import { PaginationFilter } from './common/pagination-filter.model';
export interface OrderFilter extends PaginationFilter {
  name?: string;
  countryId?: number;
  cityId?: number;
  categoryId?: number;
  storeId?: number;
  statusId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  query?: string | null;
  warehouseId?: number | null;
  scheduledDate?: Date | null;
}
