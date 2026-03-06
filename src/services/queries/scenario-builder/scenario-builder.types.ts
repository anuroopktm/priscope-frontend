export interface CustomerPayload {
  customer_id?: string;
  customer_code?: string;
  customer_name: string;
}

export interface CreateScenarioRequest {
  base_currency: string;
  customers: CustomerPayload[];
  name: string;
}

export interface CreateScenarioResponse {
  id: string;
  tenant_id: string;
  name: string;
  base_currency: string;
  status: string;
  message: string;
}

export interface SearchScenariosRequest {
  search?: string;
  filter: Record<string, any>;
  page_size: number;
  skip: number;
}

export interface Scenario {
  id: string;
  name: string;
  status: string;
  sync_status: string;
  created_by: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ScenarioDetail extends Scenario {
  tenant_id: string;
  base_currency: string;
  forked_from: string | null;
  grid_data: Record<string, any>;
  customers: CustomerPayload[];
  updated_by: Record<string, any>;
}

export interface SearchScenariosResponse {
  total: number;
  scenarios: Scenario[];
}

export interface SaveScenarioGridRequest {
  scenario_id: string;
  grid_data: any;
}

export interface SaveScenarioGridResponse {
  message: string;
  id: string;
}

export interface PublishScenarioResponse {
  id: string;
  status: string;
  published_rows: number;
  message: string;
}

export interface PartialPublishScenarioRequest {
  scenario_id: string;
  row_ids: string[];
}

export interface CreateScenarioCommentRequest {
  cell_ref: string;
  comment: string;
}

export interface ScenarioComment {
  id: string;
  scenario_id: string;
  cell_ref: string;
  comment: string;
  created_by: {
    name?: string;
    email?: string;
    status?: string;
    user_id?: string;
    is_admin?: boolean;
    tenant_id?: string;
    avatar?: string;
  };
  created_at: string;
}

export interface SearchScenarioCommentsRequest {
  search?: string;
  cell_ref?: string;
  page_size?: number;
  skip?: number;
}

export interface ScenarioCommentListResponse {
  total: number;
  comments: ScenarioComment[];
}
