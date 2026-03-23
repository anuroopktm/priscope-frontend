export interface CompanyInfoResponse {
  company_name: string;
  company_website: string;
  industry: string;
  company_size: string;
  primary_location: string;
  base_currency: string;
  company_logo_url: string;
}

export interface Field {
  system_field: string;
  label: string;
}

export interface SystemFieldResponse {
  fields: Field[];
}

export interface UpdateSystemFieldPayload {
  system_field: string;
  label: string;
}
[];

export interface AttributeResponseFields {
  name: string;
  label: string;
}

export interface UpdateAttributesFieldPayload {
  attributes: {
    name: string;
    label: string;
  }[];
}

export interface OperationsSettingsResponse {
  system_identifier: string;
}

export interface AlertsSettingsResponse {
  fx_threshold?: number | null;
  tariff_threshold?: number | null;
  freight_threshold?: number | null;
}
