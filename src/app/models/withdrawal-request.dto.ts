import { BaseDto } from './common/base.dto';

export interface WithdrawalRequestDto extends BaseDto {
  storeId?: number;
  store?: string;
  amount?: number;
  accountHolder?: string;
  document?: string;
  bank?: string;
  accountNumber?: string;
  description?: string;
  status?: number;
  processedAt?: Date;
}
