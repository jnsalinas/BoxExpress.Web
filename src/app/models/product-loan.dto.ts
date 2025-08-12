import { BaseDto } from './common/base.dto';
import { ProductLoanStatus } from './enums/product-loan-status.enum';
import { ProductLoanDetailDto } from './product-loan-detail.dto';

export interface ProductLoanDto extends BaseDto {
  loanDate?: Date;
  responsibleName?: string;
  notes?: string;
  warehouseId?: number;
  warehouseName?: string;
  companyName?: string;
  createdById?: number; 
  createdByName?: string;
  status?: ProductLoanStatus;
  processedAt?: Date;
  processedById?: number;
  processedByName?: string;
  totalRequestedQuantity?: number;  
  totalDeliveredQuantity?: number;
  totalReturnedQuantity?: number;
  totalPendingReturnQuantity?: number;  
  details?: ProductLoanDetailDto[];
  productLoanId?: number;
}
