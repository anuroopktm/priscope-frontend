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
}[]
