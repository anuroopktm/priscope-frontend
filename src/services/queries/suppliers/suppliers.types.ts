export interface SearchSuppliersRequest {
  search: string;
  page_size: number;
  skip: number;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  supplier_cost?: Record<string, any>;
  attribute?: Record<string, any>;
  is_deleted?: boolean;
}

export interface SearchSuppliersResponse {
  total: number;
  suppliers: Supplier[];
}
