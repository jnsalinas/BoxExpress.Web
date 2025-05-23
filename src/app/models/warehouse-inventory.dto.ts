import { WarehouseTransferStatus } from '../constants/warehouse-transfer-status';
import { BaseDto } from './common/base.dto';
import { ProductVariantDto } from './product-variant.dto';
import { WarehouseInventoryTransferDetailDto } from './warehouse-inventory-transfer-detail.dto';
import { WarehouseDto } from './warehouse.dto';

export interface WarehouseInventoryDto extends BaseDto {
  warehouseId?: number;
  quantity?: number;
  status?: number;
  query?: string;
  reservedQuantity?: number;
  availableQuantity?: number;
  productVariant?: ProductVariantDto;
  warehouse?: WarehouseDto;
  pendingReturnQuantity?: number;
}