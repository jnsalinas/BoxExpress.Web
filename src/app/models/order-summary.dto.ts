import { BaseDto } from './common/base.dto';
import { OrderItemDto } from './order-item.dto';

export interface OrderSummaryDto extends BaseDto {
    orderStatusId?: number;
    statusName: string;
    count?: number;
}
