import { BaseDto } from './common/base.dto';

export interface ProductLoanDetailDto extends BaseDto {
    productLoanId?: number;
    productVariantId?: number;
    productVariantName?: string;
    productName?: string;
    productVariantDescription?: string;
    requestedQuantity?: number;
    deliveredQuantity?: number; 
    returnedQuantity?: number;
    pendingReturnQuantity?: number;
    lostQuantity?: number;
    isAccepted?: boolean;
}
