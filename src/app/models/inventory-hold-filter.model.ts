import { PaginationFilter } from './common/pagination-filter.model';
import { InventoryHoldStatus } from './enums/inventory-hold-status.enum';

export interface InventoryHoldFilter extends PaginationFilter {
  productVariantId?: number;
  warehouseInventoryId?: number;
  status?: InventoryHoldStatus;
  statuses?: InventoryHoldStatus[];

}
