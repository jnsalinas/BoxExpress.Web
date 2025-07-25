import { BaseDto } from "./common/base.dto";
import { ProductVariantDto } from "./product-variant.dto";
import { WarehouseDto } from "./warehouse.dto";
import { InventoryMovementType } from "../models/enums/inventory-movement-type.enum";

export interface InventoryMovementDto extends BaseDto {
  id: number;
  productVariant: ProductVariantDto;
  warehouse: WarehouseDto;
  movementType: InventoryMovementType;
  quantity: number;
  orderId?: number;
  transferId?: number;
  reference?: string;
  notes?: string;
  creator: string;
}