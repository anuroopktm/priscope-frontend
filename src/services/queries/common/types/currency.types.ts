export interface GlobalCurrency {
  id: string;
  currency: string;
  status: boolean;
  description: string;
}

export interface GlobalCurrenciesRequest {
  search: string;
  page_size: number;
  skip: number;
}

export interface GlobalCurrenciesResponse {
  total: number;
  currencies: GlobalCurrency[];
}
