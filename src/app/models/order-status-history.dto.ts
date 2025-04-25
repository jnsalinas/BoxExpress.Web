import { ProductVariantDto } from './product-variant.dto';
import { BaseDto } from './common/base.dto';

export interface OrderStatusHistoryDto extends BaseDto {
  creator?: string;
  oldStatus?: string;
  newStatus?: number;
}
