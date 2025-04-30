import { BaseDto } from './common/base.dto';

export interface StoreDto extends BaseDto {
    country?: string;
    city?: string;
    walletId?: number;
}