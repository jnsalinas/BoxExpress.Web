  export interface OrderFilter {
    name?: string;
    countryId?: number;
    cityId?: number;
    categoryId?: number;
    storeId?: number;
    statusId?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    orderId?: string | null;
  }
  