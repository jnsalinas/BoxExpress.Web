import { BaseDto } from './common/base.dto';
import { ProductLoanStatus } from './enums/product-loan-status.enum';
import { ProductLoanDetailDto } from './product-loan-detail.dto';

export interface ProductLoansDto extends BaseDto {

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
  productLoanItems?: ProductLoanDetailDto[];

  // public DateTime LoanDate { get; set; }
  // public string ResponsibleName { get; set; } = string.Empty;
  // public string? Notes { get; set; }
  // public int WarehouseId { get; set; }
  // public string WarehouseName { get; set; } = string.Empty;
  // public string CompanyName { get; set; } = string.Empty;
  // public int CreatedById { get; set; }
  // public string CreatedByName { get; set; } = string.Empty;
  // public ProductLoanStatus Status { get; set; }
  // public DateTime? ProcessedAt { get; set; }
  // public int? ProcessedById { get; set; }
  // public string? ProcessedByName { get; set; }
  // public int TotalRequestedQuantity { get; set; }
  // public int TotalDeliveredQuantity { get; set; }
  // public int TotalReturnedQuantity { get; set; }
  // public int TotalPendingReturnQuantity { get; set; }
  
}
