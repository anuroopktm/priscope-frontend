import type { AlertColor } from "@mui/material";

export interface ActionBarProps {
  alignment: string;
  onAlignmentChange: (event: React.MouseEvent<HTMLElement>, newAlignment: string) => void;
  onSearchChange: (value: string) => void;
  setShowFilesModal: any;
}

export type UploadResponse = {
  id: string;
  url: string;
  message: string;
};

export interface FreightRate {
  id: string;
  port_of_origin: string;
  port_of_destination: string;
  container_type: string;
  currency: string;
  rate: number;
  valid_from: string;
  valid_to: string;
  status: string;
  last_updated_at: string;
  last_updated_by?: Record<string, string | boolean | null> | null;
  comments: any[];
  expired: boolean;
  expiry_count: number;
  threshold_breach: boolean;
  threshold_expiry: number;
}

export interface FreightRateResponse {
  total: number;
  freight_rates: FreightRate[];
}

export interface FreightRateRequest {
  page_size: number;
  search: string;
  skip: number;
  tenant_id: string;
}

export interface FreightRateCreateRequest {
  action_key: string;
  comments: {
    comment: string;
    comment_type: "field" | "row"; // you can extend if more types are possible
    field_key?: string;
  }[];
  container_type_id: string;
  currency: string;
  port_of_destination: string;
  port_of_origin: string;
  rate: number;
  source: string;
  tenant_id: string;
  valid_from: string; // ISO date string
  valid_to: string; // ISO date string
}

export interface FreightRateCreateResponse {
  action_key: string;
  comments: {
    comment: string;
    comment_type: "field" | "row";
    field_key?: string;
  }[];
  container_type: string;
  currency: string;
  last_updated_at: string; // ISO timestamp
  last_updated_by: {
    user_id: string;
    username: string;
  };
  port_of_destination: string;
  port_of_origin: string;
  rate: number;
  source: string;
  status: string; // e.g., "active"
  tenant_id: string;
  valid_from: string; // ISO date string
  valid_to: string; // ISO date string
}

export interface ContainerTypesRequest {
  tenant_id?: string;
  search?: string;
}
// Type definition for the response
export interface ContainerTypesResponse {
  container_types: Array<{
    description: string;
    id: string;
    type: string;
  }>;
}

export interface GlobalCurrenciesRequest {
  search?: string;
  page_size: number;
  skip: number;
}

export interface Currency {
  id: string;
  currency: string;
  status: boolean;
  description: string;
}

export interface GlobalCurrenciesResponse {
  total: number;
  currencies: Currency[];
}

export interface ContainerTypeCreateRequest {
  description?: string;
  tenant_id?: string;
  type: string;
}

export interface ContainerTypeCreateResponse {
  description?: string;
  id: string;
  type: string;
}


export interface CommentInput {
  comment: string;
  fieldKey: string;
}

export interface CreateFreightRateRequestBodyParams {
  comments: CommentInput[];
  updatedFields: Record<string, any>;
  tenantId: string;
  [key: string]: any;
}

export interface BulkStatusUpdateResponse {
  message: string;
  total_count: number;
  processed_count: number;
  unprocessed_count: number;
  status_updated_to: string;
  comments_added: number;
}

export interface BulkStatusUpdateRequest {
  action_key: "status";
  ids: string[];
  source: "freight_rate" | "tariff_rate";
  status: "active" | "inactive";
  tenant_id: string;
}

export type SnackbarState = {
  message: string | null;
  severity: AlertColor;
};

export type FreightRateCommentsRequest = {
  tenant_id: string;
  search?: string;
  skip?: number;
  page_size?: number;
};

export type CommentType = "field" | "row";

export interface FreightRateComment {
  comment: string;
  comment_type: CommentType;
  field_key?: string; // only for field comments
}

export interface CreateFreightRateCommentPayload {
  tenant_id: string;
  comments: FreightRateComment[];
  source: string; // "freight_rate"
  action_key?: string;
}

export interface CreateFreightRateCommentParams {
  freightRateId: string | number;
  payload: CreateFreightRateCommentPayload;
}

export interface UserInfo {
  email: string;
  name: string;
  user_id: string;
  tenant_id: string | "None";
  status: string;
  is_admin: boolean;
}

export interface FreightRateCommentResponse {
  id: string;
  tenant_id: string;
  freight_rate_id: string;
  comment_type: "field" | "row";
  freight_field_key?: string; 
  comment: string;
  source: string; 
  action: string; 
  action_key?: string;
  created_at: string;
  created_by: UserInfo;
  updated_at: string;
  updated_by: UserInfo;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: UserInfo | null;
}

export type CreateFreightRateCommentResponse = FreightRateCommentResponse[];


