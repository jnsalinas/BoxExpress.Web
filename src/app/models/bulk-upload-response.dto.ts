export interface BulkUploadResponse {
  data: BulkUploadData[];
}

export interface BulkUploadData {
  code: string;
  message: string;
  isLoaded: boolean;
} 