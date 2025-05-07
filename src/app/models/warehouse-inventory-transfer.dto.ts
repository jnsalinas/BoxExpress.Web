import { WarehouseTransferStatus } from '../constants/warehouse-transfer-status';
import { BaseDto } from './common/base.dto';
import { WarehouseInventoryTransferDetailDto } from './warehouse-inventory-transfer-detail.dto';

export interface WarehouseInventoryTransferDto extends BaseDto {
  toWarehouse?: string;
  fromWarehouse?: number;
  fromWarehouseId?: number;
  toWarehouseId?: string;
  transferDetails?: WarehouseInventoryTransferDetailDto[];
  creator?: string;
  status?: WarehouseTransferStatus;
  acceptedBy?: string;
  rejectionReason?: string;
  statusName?: string;
}
