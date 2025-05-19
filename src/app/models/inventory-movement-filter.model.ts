import { PaginationFilter } from "./common/pagination-filter.model";

export interface InventoryMovementFilter extends PaginationFilter {
    productVariantId?: number;
    warehouseId?: number;
    movementType?: string;
    orderId?: number;
    transferId?: number;
    reference?: string;
    notes?: string;
    startDate?: Date;
    endDate?: Date;
}
