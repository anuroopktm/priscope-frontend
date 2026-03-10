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
