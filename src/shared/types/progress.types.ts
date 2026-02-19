export type ProgressStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "processed_failed";

export type ProgressType = "upload_progress" | "export_main" | "export_audit";

export type ActionType =
  | "freight_rate"
  | "items_master"
  | "tariff_rate"
  | "fx_rate"

export interface ProgressEvent {
  action: ActionType
  upload_id?: string;
  export_id?: string;
  type: ProgressType;
  status: ProgressStatus;
  processed_rows: number;
  total_rows: number;
}
