export type UploadResponse = {
  id: string;
  url: string;
  message: string;
};

export interface TariffRateRequest {
  page_size: number;
  search: string;
  skip: number;
  tenant_id: string;
}

export interface TariffRate {
  id: string;
  country_of_origin: string;
  country_of_destination: string;
  hs_code: string;
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

export interface TariffRateResponse {
  total: number;
  tariff_rates: TariffRate[];
}

export type TariffRateCommentsRequest = {
  tenant_id: string;
  search?: string;
  skip?: number;
  page_size?: number;
};


export interface TariffRateCreateRequest {
  tenant_id: string;
  country_of_origin: string;
  country_of_destination: string;
  hs_code: string;
  rate: number;
  valid_from: string; 
  valid_to: string;  
  comments?: {
    comment_type: string;
    tariff_field_key: string;
    comment: string;
  }[];
  last_change_source: string;
  action_key: string;
}

export interface TariffRateCreateResponse {
  id: string;
  tenant_id: string;
  country_of_origin: string;
  country_of_destination: string;
  hs_code: string;
  rate: number;
  valid_from: string;
  valid_to: string;
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  email: string;
  name: string;
  user_id: string;
  tenant_id: string | "None";
  status: string;
  is_admin: boolean;
}

export interface TariffRateCommentResponse {
  id: string;
  tenant_id: string;
  tariff_rate_id: string;
  comment_type: "field" | "row";
  tariff_field_key?: string; 
  comment: string;
  source: "tariff_rate";
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

export type CreateTariffRateCommentResponse = TariffRateCommentResponse[];

export interface CreateTariffRateCommentParams {
  tariffRateId: string | number;
  payload: {
    tenant_id: string;
    comments: {
      comment: string;
      comment_type: "field" | "row";
      field_key?: string;
    }[];
    source: "tariff_rate";
    action_key?: string;
  };
}