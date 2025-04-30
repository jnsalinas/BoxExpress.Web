import { PaginationDto } from "./pagination.dto";

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    pagination? : PaginationDto
  }
  