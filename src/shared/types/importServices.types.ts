export interface ImportRequest {
  module_name: string;
  feature_name: string;
  file: File;
  options?: Record<string, any>;
}

export interface ImportResponse {
  success: boolean;
  message?: string;
  import_id?: string;
}

export interface ImportUploadItem {
  id?: string;
  file_name?: string;
  status?: string;
  total_records?: number;
  success_count?: number;
  failed_count?: number;
  created_at?: string;
  created_by?: Record<string, unknown>;
  log_file_url?: string;
}

export interface ImportSummaryCount {
  total_records: number;
  success_count: number;
  failed_count: number;
  pending_count?: number;
}