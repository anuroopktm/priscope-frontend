export interface FreightRate {
  id: string;
  port_of_origin: string;
  port_of_destination: string;
  mode: string;
  container_type?: string;
  carrier: string;
  rate: number;
  currency: string;
  valid_from: string | null;
  valid_to: string | null;
  status: string;
  last_updated_at: string;
}

export interface FreightRatesSearchResponse {
  freight_rates: FreightRate[];
  total_count: number;
}

export interface FreightRatesSearchParams {
  search?: string;
  origin?: string;
  destination?: string;
  mode?: string;
  page_size?: number;
  skip?: number;
}
