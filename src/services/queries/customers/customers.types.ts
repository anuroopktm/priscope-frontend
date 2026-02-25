export interface Customer {
  id: string;
  code: string;
  name: string;
  customer_cost: Record<string, any>;
  attribute: Record<string, any>;
  is_deleted: boolean;
}

export interface SearchCustomersRequest {
  search: string;
  page_size: number;
  skip: number;
}

export interface SearchCustomersResponse {
  total: number;
  customers: Customer[];
}
