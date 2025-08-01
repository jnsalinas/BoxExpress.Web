import { BaseDto } from './common/base.dto';

export interface AddressDto extends BaseDto {
  address: string;
  complement?: string;
  postalCode?: string;
  cityId: number;
  latitude?: number;
  longitude?: number;
}
