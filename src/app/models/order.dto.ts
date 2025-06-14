import { BaseDto } from './common/base.dto';
import { OrderItemDto } from './order-item.dto';

export interface OrderDto extends BaseDto {
  country?: string;
  city?: string;
  deliveryDate?: Date;
  rescheduleDate?: Date;
  scheduledDate?: Date;
  contains?: string;
  latitude?: string;
  longitude?: string;
  clientAddress?: string;
  clientFullName?: string;
  clientDocument?: string;
  clientPhone?: string;
  totalAmount: number;
  status?: string;
  statusId?: number;
  category?: string;
  categoryId?: number;
  storeName?: string;
  storeId?: number;
  notes?: string;
  code?: string;
  deliveryFee?: number;
  warehouseId?: number | null;
  timeSlotStartTime?: Date;
  timeSlotEndTime?: Date;
  timeSlotId?: number;
  currencyCode?: string;
  orderItems?: OrderItemDto[]
}
