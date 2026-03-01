import { baseGridCfg } from "../tree-grid/config/layout";

// Header
export interface itemMasterHeaderResponse {
  total: number;
  headers: itemMasterHeaderResponseArrayList[];
}

export interface itemMasterHeaderResponseArrayList {
  id: string;
  tenant_id: string;
  label: string;
  name: string;
  is_mandatory: boolean;
  data_type: string;
  created_by: itemMasterHeaderResponseArrayCreatedByList;
  created_at: string;
  updated_at: string;
  istinct_values_count: number;
  filter_type: string;
  distinct_values: string[];
}
export interface itemMasterHeaderResponseArrayCreatedByList {
  name: string;
  email: string;
  status: string;
  user_id: string;
  is_admin: boolean;
  tenant_id: string;
}

export interface TreeGridHeader {
  Name: string;
  Type: "Text" | "Number" | "Date";
  RelWidth: number;
  CanEdit: 0 | 1;
  Visible: 0 | 1;
}

export interface TreeGridHeaderList {
  cols: TreeGridHeader[];
}

// Body
export interface ListItemsMasterDataPayload {
  page_size: number;
  skip: number;
}

export interface itemMasterBodyResponse {
  total: number;
  items: itemMasterBodyResponseItems[];
}

export interface itemMasterBodyResponseItemsField {
  data_type: string;
  label: string;
  value: string;
}
export interface itemMasterBodyResponseAttributesItemsField {
  [key: string]: itemMasterBodyResponseItemsField;
}

export interface itemMasterBodyResponseCreatedByField {
  name: string;
  email: string;
  status: string;
  user_id: string;
  is_admin: boolean;
  tenant_id: string;
}

export interface itemMasterBodyResponseCostField {
  [key: string]: string;
}

export interface itemMasterBodyResponseSupplierField {
  id: string;
  code: string;
  name: string;
  cost: itemMasterBodyResponseCostField;
}

export interface itemMasterBodyResponseCustomerField {
  id: string;
  code: string;
  name: string;
  cost: itemMasterBodyResponseCostField;
}

export interface itemMasterBodyResponseItems {
  id: string;
  tenant_id: string;
  SKU: itemMasterBodyResponseItemsField;
  Description: itemMasterBodyResponseItemsField;
  Category: itemMasterBodyResponseItemsField;
  "HS Code": itemMasterBodyResponseItemsField;
  attributes: Record<string, itemMasterBodyResponseItemsField>;
  upload_id: string;
  channel: string;
  created_by: itemMasterBodyResponseCreatedByField;
  updated_at: string;
  created_at: string;
  suppliers: itemMasterBodyResponseSupplierField[];
  customers: itemMasterBodyResponseCustomerField[];
  supplier_count: number;
  customer_count: number;
}

export interface TreeGridRow {
  id: string;
  [column: string]: string | number | boolean | null | undefined | {};
}

export interface TreeGridBody {
  Body: TreeGridRow[][];
}

// layout structure type
export interface TreeGridLayout {
  Cfg: typeof baseGridCfg;
  Def: {
    R: Record<string, string>;
  };
  Cols: TreeGridHeader[];
  Header: Record<string, string>;
  Solid: any[];
}

export interface TreeGridLayoutHeader {
  SKU1: string;
  UPC: string;
  Category: string;
  Description: string;
  Supplier: string;
  Customer: string;
  Visible: string;
}

// put col item master
export interface EditItemMasterColResponse {
  items: itemMasterBodyResponseItems[];
  comments?: ItemMasterCommentPayload[];
}

export interface ItemMasterCommentPayload {
  comment_type: string;
  item_field_key: string;
  comment: string;
}

export interface finalPayloadWithMetadata {
  data: itemMasterBodyResponseItems;
}

export interface EditItemMasterColPayload {
  payload: finalPayloadWithMetadata;
  item_id: string;
}

export interface ItemMasterBulkUploadData {
  id: string;
  _DefaultSort: number;
  SKU: string;
  UPC: string;
  Category: string;
  Description: string;
  "HS Code": string;
  Size: string;
  Supplier: string;
  Customer: string;
}

export interface ItemMasterBulkUploadFormattedDataComment {
  comment_type: string;
  item_field_key: string;
  comment: string;
}

export interface ItemMasterBulkUploadFormattedDataItem {
  frontend_id?: string;
  sku?: string;
  upc?: string;
  category?: string;
  hs_code?: string;
  description?: string;
  source_type?: string;
  attribute?: {};
  temp_sku?: boolean;
  upload_id?: string;
  comments?: ItemMasterBulkUploadFormattedDataComment[];
  source?: string;
  action_key?: string;
}

export interface ItemMasterBulkUploadFormattedDataPayload {
  items: ItemMasterBulkUploadFormattedDataItem[];
}

export interface ItemMasterBulkUploadResponseType {
  success: boolean;
  message: string;
  total_items: number;
  inserted_count: number;
  skipped_count: number;
  inserted_items: ItemMasterBulkUploadResponseTypeInsertedItems[];
  skipped_items: any[];
}

export interface ItemMasterBulkUploadResponseTypeInsertedItems {
  [column: string]: string | number | null;
}

// export item master row
export interface ExportItemMasterRowResponse {
  queued: boolean;
  export_id: string;
  message_id: null;
  queue_url: null;
}

export interface ExportItemMasterRowResponseParameters {
  ids: string[];
  filter: {};
  options: {};
}

export interface ExportItemMasterRowPayload {
  module_name: string;
  feature_name: string;
  file_type: string;
  parameters: ExportItemMasterRowResponseParameters;
}

// bulk insert admin add
export interface AddBulkInsertAdminRequest {
  source_module: string;
  target_module: string;
  request_action: string;
  request_comments: string;
  request_info: (InsertRequestInfo | UpdateRequestInfo)[];
}

export interface InsertRequestInfo {
  new_record: {
    items: AddBulkInsertAdminRequestNewRecordItems[];
  };
}

export interface UpdateRequestInfo {
  old_record: {
    data: itemMasterBodyResponseItems;
  };
  new_record: {
    data: itemMasterBodyResponseItems;
    comment?: {
      comment_type: "field" | "row";
      item_field_key: string;
      comment: string;
    }[];
  };
}

export interface AddBulkInsertAdminRequestNewRecordItems {
  frontend_id: string;
  sku: string;
  upc: null;
  category: string;
  hs_code: string;
  description: string;
  source_type: string;
  attribute: Record<string, string>;
  source: string;
  action_key: string;
  comments: AddBulkInsertAdminRequestNewRecordItemsComments[];
}

export interface AddBulkInsertAdminRequestNewRecordItemsComments {
  comment_type: string;
  field_key: string;
  comment: string;
}

export interface ItemMasterBulkInsertAdminRequestResponse {
  id: string;
  tenant_id: string;
  source_module: "item_master";
  source_module_id: string | null;
  target_module: "item_master";
  target_module_id: string | null;
  request_action: "insert" | "update" | "delete";
  request_info: RequestInfo[];
  request_comments: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  requested_by: RequestedBy;
  reviewed_at: string | null;
  reviewed_by: RequestedBy | null;
  review_comments: string | null;
}

export interface RequestInfo {
  new_record: NewRecord;
}

export interface NewRecord {
  items: Item[];
}

export interface Item {
  sku: string;
  upc: string;
  source: string;
  hs_code: string;
  category: string;
  comments: ItemComment[];
  attribute: Record<string, unknown>;
  action_key: string;
  description: string;
  frontend_id: string;
  source_type: "manual" | "bulk" | string;
}

export interface ItemComment {
  comment: string;
  field_key: string;
  comment_type: "field" | "row";
}

export interface RequestedBy {
  name: string;
  email: string;
  status: "active" | "inactive";
  user_id: string;
  is_admin: boolean;
  tenant_id: string;
}

[
  {
    sku: "test",
    upc: "",
    hs_code: "",
    category: "",
    description: "",
  },
];

export interface ItemMasterRequestModalResponse {
  sku?: string;
  upc?: string;
  hs_code?: string;
  category?: string;
  description?: string;
}
// request modal
export interface itemMasterRequestModalItems {
  sku: string;
  upc: string;
  source: string;
  hs_code: string;
  category: string;
  comments: itemMasterRequestModalCommentsItems[];
  attribute: {};
  action_key: string;
  description: string;
  frontend_id: string;
  source_type: string;
}

export interface itemMasterRequestModalCommentsItems {
  comment: string;
  field_key: string;
  comment_type: "field";
}

// headers
export interface AddHeaderPayload {
  data_type: string;
  name: string;
}

export interface AddHeaderResponse {
  message: string;
  header_id: string;
}
// save filter

export interface SaveFilterPayload {
  name: string;
  filter: Record<string, string[]>;
}

export interface SaveFilterResponse {
  id: string;
  status: string;
  message: string;
}

// saved filters

export interface SavedFiltersList {
  total: number;
  filters: SavedFiltersListFilters[];
}
export interface SavedFiltersListFiltersCreatedBy {
  name: string;
  email: string;
  status: string;
  user_id: string;
  is_admin: boolean;
  tenant_id: string;
}
export interface SavedFiltersListFilters {
  id: string;
  name: string;
  filter: Record<string, string[]>;
  filter_type: string;
  description: string;
  created_by: SavedFiltersListFiltersCreatedBy;
}

export interface SkippedItem {
  frontend_id: string;
  [key: string]: any;
}