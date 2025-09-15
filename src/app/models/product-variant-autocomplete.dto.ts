import { BaseDto } from './common/base.dto';

export class ProductVariantAutocompleteDto implements BaseDto {
  id: number = 0;
  name: string = '';
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  quantity?: number;
  shopifyId?: string;
  sku?: string;
  productName?: string;
  displayName?: string;
  availableUnits?: number;
  reservedQuantity?: number;
  storeName?: string;
  storeId?: number;
}
