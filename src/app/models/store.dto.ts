import { BaseDto } from './common/base.dto';

export interface StoreDto extends BaseDto {
  country?: string;
  city?: string;
  walletId?: number;
  balance?: number;
  availableToWithdraw?: number;
  pendingWithdrawals?: number;
  shopifyShopDomain?: string;
  username?: string;
  password?: string;
}
