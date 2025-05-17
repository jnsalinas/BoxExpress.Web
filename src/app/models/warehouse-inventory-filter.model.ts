import { PaginationFilter } from './common/pagination-filter.model';

export interface WarehouseInventoryFilter extends PaginationFilter {
  warehouseId?: number;
  productVariantId?: number;
  quantity?: number;
  reservedQuantity?: number;
  query?: string;
}
