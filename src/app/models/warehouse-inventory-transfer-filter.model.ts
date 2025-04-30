import { PaginationFilter } from './common/pagination-filter.model';

export interface WarehouseInventoryTransferFilter extends PaginationFilter {
  warehouseDestinationId?: number;
  warehouseOriginId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}
