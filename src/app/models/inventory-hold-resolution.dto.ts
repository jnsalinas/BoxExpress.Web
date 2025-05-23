import { BaseDto } from './common/base.dto';
import { InventoryHoldStatus } from './enums/inventory-hold-status.enum';

export interface InventoryHoldResolutionDto {
  inventoryHoldId: number;
  notes: string;
  status: InventoryHoldStatus;
}
