import { ProductVariantDto } from './product-variant.dto';
import { BaseDto } from './common/base.dto';

export interface OrderCategoryHistoryDto extends BaseDto {
  creator?: string;
  oldCategory?: string;
  newCategory?: number;
}
