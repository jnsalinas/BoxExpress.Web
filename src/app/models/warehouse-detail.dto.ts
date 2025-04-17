import { ProductDto } from './product.dto';
import { WarehouseDto } from './warehouse.dto';

export interface WarehouseDetailDto extends WarehouseDto {
  products?: ProductDto[];
}
