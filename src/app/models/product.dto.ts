import { ProductVariantDto } from './product-variant.dto';
import { BaseDto } from './common/base.dto';

export interface ProductDto extends BaseDto {
    shopifyId?: string;
    sku?: string;
    price?: number;
    variants: ProductVariantDto[];
}