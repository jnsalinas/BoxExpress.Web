import { BaseDto } from './common/base.dto';

export interface WarehouseDto extends BaseDto {
  cityId?: number;
  countryId?: number;
  cityName?: string;
  countryName?: string;
  address?: string;
  manager?: string;
}
