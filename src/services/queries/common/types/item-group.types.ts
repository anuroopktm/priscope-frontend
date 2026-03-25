export interface CreateItemGroupRequest {
  description: string;
  item_ids: string[];
  name: string;
}

export interface CreateItemGroupResponse {
  id: string;
  name: string;
  description: string;
  item_count: number;
  message: string;
}

export interface SearchItemGroupsRequest {
  page_size: number;
  skip: number;
  search?: string;
}

export interface ItemGroupSummary {
  id: string;
  name: string;
  description: string;
  item_count: number;
  created_by: any;
  created_at: string;
  updated_at: string;
}

export interface SearchItemGroupsResponse {
  total: number;
  groups: ItemGroupSummary[];
}

export interface ItemGroupDetail {
  id: string;
  name: string;
  description: string;
  items: any[];
  created_by: any;
  created_at: string;
  updated_at: string;
}
