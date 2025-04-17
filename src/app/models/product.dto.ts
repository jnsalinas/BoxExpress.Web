import { ProductVariantDto } from './product-variant.dto';
import { BaseDto } from './base.dto';

export interface ProductDto extends BaseDto {
    shopifyId?: string;
    sku?: string;
    price?: number;
    variants: ProductVariantDto[];
}