import { BaseDto } from './common/base.dto';
import { InventoryHoldType } from '../models/enums/inventory-hold-type.enum';
import { InventoryHoldStatus } from '../models/enums/inventory-hold-status.enum';
import { OrderItemDto } from './order-item.dto';
import { WarehouseInventoryDto } from './warehouse-inventory.dto';

export interface InventoryHoldDto extends BaseDto {
  warehouseInventoryId?: number;
  quantity?: number;
  orderItemId?: number;
  transferId?: number;
  type?: InventoryHoldType;
  status?: InventoryHoldStatus;
  creatorId?: number;
  orderItem?: OrderItemDto;
  productVariantName?: string;
  warehouseName?: string;
  warehouseInventory?: WarehouseInventoryDto;
}
