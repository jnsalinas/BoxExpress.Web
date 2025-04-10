import { ProductDetailDto } from './product-detail.dto';
import { WarehouseDto } from './warehouse.dto';

export interface WarehouseDetailDto extends WarehouseDto {
  products?: ProductDetailDto[];
}
