import { ProductDto } from './product.dto';
import { BaseDto } from './base.dto';

export interface WarehouseDto extends BaseDto {
  cityId?: number;
  countryId?: number;
  cityName?: string;
  countryName?: string;
  address?: string;
  manager?: string;
}
