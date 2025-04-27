export interface WalletTransactionDto {
  store?: string;
  amount?: number;
  id?: number;
  description?: string;
  relatedOrderId?: number;
  userName?: string;
  orderStatus?: string;
  transactionType?: string;
  createdAt?: Date;
}