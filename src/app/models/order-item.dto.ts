import { BaseDto } from './common/base.dto';

export interface OrderItemDto extends BaseDto {
  productVariantId?: number;
  productVariantName?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  orderId?: number;
}
