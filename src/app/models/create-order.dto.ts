import { OrderItemDto } from "./order-item.dto";

export interface CreateOrderDto {
  id?: number;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  clientAddressComplement?: string;
  cityId: number;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  storeId: number;
  deliveryFee: number;
  currencyId: number;
  code?: string;
  contains?: string;
  totalAmount: number;
  notes?: string;
  orderItems: OrderItemDto[];
}