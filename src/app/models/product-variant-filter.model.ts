import { PaginationFilter } from './common/pagination-filter.model';

export interface ProductVariantFilter extends PaginationFilter {
  id?: number;
  storeId?: number;
  warehouseId?: number;
}
