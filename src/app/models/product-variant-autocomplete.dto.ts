import { BaseDto } from './base.dto';

export interface ProductVariantAutocompleteDto extends BaseDto {
  quantity: number;
  shopifyId?: string;
  sku?: string;
  productName?: string;
}
