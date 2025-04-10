import { ProductDto } from './product.dto';
import { ProductVariantDto } from './product-variant.dto';

export interface ProductDetailDto extends ProductDto {
  shopifyId?: string;
  variants: ProductVariantDto[];
}
