import { BaseDto } from './common/base.dto';
import { InventoryMovementDto } from './inventory-movement.dto';
import { ProductDto } from './product.dto';
import { StoreDto } from './store.dto';

export interface ProductVariantDto extends BaseDto {
  quantity: number;
  shopifyVariantId?: string;
  sku?: string;
  price?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  inventoryMovements? : InventoryMovementDto[];
  product: ProductDto
  warehouseInventoryId?: number;
  pendingReturnQuantity?: number;
  store?: StoreDto;
  productName?: string;
  productSku?: string;
  productPrice?: number;
  totalQuantity?: number;
  warehouseName?: string;
  deliveredQuantity?: number;
  displayName?: string;
  warehouseId?: number;
}
