export interface ExportRequest {
  module_name: string;
  feature_name: string;
  file_type: string;
  parameters: {
    ids: string[];
    filter?: Record<string, any>;
    options?: Record<string, any>;
  };
}

export interface ExportResponse {
  success: boolean;
  message?: string;
  export_id?: string;
}

export type ListExportRequest = {
  modules?: string[];
  features?: string[];
  status?: string[];
  date_from?: string;
  date_to?: string;
};

type ListExportResponseItem = {
  id?: string;
  module_name?: string;
  feature_name?: string;
  file_type?: string;
  parameters?: Record<string, unknown>;
  status?: string;
  created_by?: Record<string, unknown>;
  file_url?: string;
  file_object_key?: string;
  total_records?: number;
  created_at?: string;
  updated_at?: string;
};

export type ListExportResponse = ListExportResponseItem[];

export interface DownloadFileResponse {
  success: boolean;
  download_url: string;
  export_id: string;
  message: string;
}
