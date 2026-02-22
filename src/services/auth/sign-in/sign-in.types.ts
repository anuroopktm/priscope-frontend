export interface UserLoginRequest {
  encrypted: string;
  nonce: string;
}

export interface UserLoginResponse {
  access_token: string;
  refresh_token: string;
  access_token_expiry_minutes: number;
  token_type: "bearer";
  user_id: string;
  tenant_id: string | null;
  privileges: Privileges;
  last_login: string | null;
}

interface Privileges {
  user_management?: Permission[];
  margin?: Permission[];
  billing?: Permission[];
  privilege?: Permission[];
  freight_rate?: Permission[];
  tariff_rate?: Permission[];
  fx_rate?: Permission[];
  request?: Permission[];
  item_master?: Permission[];
}

type Permission =
  | "view"
  | "view_all_request"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "import"
  | "enable_disable"
  | "detailed_view"
  | "assign"
  | "revoke"
  | "review";
