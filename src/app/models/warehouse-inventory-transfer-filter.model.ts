import { PaginationFilter } from './common/pagination-filter.model';

export interface WarehouseInventoryTransferFilter extends PaginationFilter {
  fromWarehouseId?: number;
  toWarehouseId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  statusId?: number | null;
}
