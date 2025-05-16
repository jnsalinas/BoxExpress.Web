import { BaseDto } from './common/base.dto';

export interface ProductVariantDto extends BaseDto {
  quantity: number;
  shopifyId?: string;
  sku?: string;
  price?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
}
