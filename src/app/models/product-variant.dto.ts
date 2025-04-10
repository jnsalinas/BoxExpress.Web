import { BaseDto } from './base.dto';

export interface ProductVariantDto extends BaseDto {
  quantity: number;
  shopifyId?: string
}
