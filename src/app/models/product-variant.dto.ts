import { BaseDto } from './common/base.dto';
import { InventoryMovementDto } from './inventory-movement.dto';
import { ProductDto } from './product.dto';

export interface ProductVariantDto extends BaseDto {
  quantity: number;
  shopifyId?: string;
  sku?: string;
  price?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  inventoryMovements? : InventoryMovementDto[];
  product: ProductDto
  warehouseInventoryId?: number;
}
