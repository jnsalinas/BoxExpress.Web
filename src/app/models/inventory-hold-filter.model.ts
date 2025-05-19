import { PaginationFilter } from "./common/pagination-filter.model";

export interface InventoryHoldFilter extends PaginationFilter {
    productVariantId?: number;
    warehouseInventoryId?: number;
}
