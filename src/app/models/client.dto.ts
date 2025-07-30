import { AddressDto } from './address.dto';
import { BaseDto } from './common/base.dto';

export interface ClientDto extends BaseDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addresses?: AddressDto[];
}
