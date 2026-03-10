export interface TariffRate {
  id: string;
  country_of_origin: string;
  country_of_destination: string;
  hs_code: string;
  rate: number;
  valid_from: string | null;
  valid_to: string | null;
  status: string;
  last_updated_at: string;
  expired: boolean;
  expiry_count: number;
  threshold_breach: boolean;
  threshold_expiry: number;
}

export interface TariffRatesSearchResponse {
  tariff_rates: TariffRate[];
  total_count: number;
}

export interface TariffRatesSearchParams {
  search?: string;
  page_size?: number;
  skip?: number;
}
