export interface BulkUploadResponseDto {
  data: BulkUploadDataDto[];
}

export interface BulkUploadDataDto {
  code: string;
  message: string;
  isLoaded: boolean;
  rowNumber: number;
  id?: number;
} 