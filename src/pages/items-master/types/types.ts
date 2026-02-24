import type { itemMasterBodyResponseItems } from "../helpers/types";

export type SystemFieldMappingData = {
  [key: string]: string;
};

export type AttributeConfigurationData = {
  [key: string]: {
    dataType: string;
    mandatory: boolean;
  };
};

export type DataMappingModalProps = {
  open: boolean;
  onClose: () => void;
  fileName?: string;
  onImport?: (data: {
    systemFieldMapping: SystemFieldMappingData;
    attributeConfiguration: AttributeConfigurationData;
    saveAsTemplate: boolean;
  }) => void;
};

export type SystemFieldMappingProps = {
  fileName: string;
  systemFieldMapping: SystemFieldMappingData;
  onSystemFieldChange: (
    field: keyof SystemFieldMappingData,
    value: string,
  ) => void;
  saveAsTemplate: boolean;
  onSaveAsTemplateChange: (value: boolean) => void;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  onTemplateSelect?: (templateId: string) => void;
};

export type AttributeConfigurationProps = {
  fileName: string;
  attributeConfiguration: AttributeConfigurationData;
  onAttributeConfigChange: (
    attribute: string,
    field: "dataType" | "mandatory",
    value: string | boolean,
  ) => void;
  saveAsTemplate: boolean;
  onSaveAsTemplateChange: (value: boolean) => void;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  selectedTemplate: string;
};

export interface SelectedField {
  key: string;
  value: string;
  field?: string;
}
// Types for map-fields API
export type SystemField = {
  label: string;
  header: string;
  data_type?: string;
};

export type AttributeField = {
  header: string;
  data_type: string;
  is_mandatory: boolean;
};

export type MapFieldsRequestBody = {
  is_template: boolean;
  template_name?: string;
  control_fields: Record<string, string>;
  system_fields: SystemField[];
  attributes: AttributeField[];
};

export type MapFieldsResponse = {
  message: string;
  confirm_field_id?: string;
};
export type MapFieldsRequest = {
  upload_id: string | number;
  payload: MapFieldsRequestBody;
  update_if_exists: boolean;
};

export interface SystemFieldObject {
  id: string;
  tenant_id: string;
  config_id: string;
  name: string;
  label: string;
  source_type: string;
  confirm_field_id: string | null;
  is_required: boolean;
  created_at: string;
  modified_at: string;
  destroyed_at: string | null;
}

export interface SystemFieldsResponse {
  total: number;
  data: SystemFieldObject[];
}

export interface ListRequestBody {
  search: string;
  page_size: number;
  skip: number;
  filter?: Record<string, string[]>;
}
export interface Template {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ListTemplatesResponse {
  total: number;
  templates: Template[];
}
export interface Header {
  id: string;
  label: string;
  name: string;
  is_mandatory: boolean;
  data_type: string;
  created_at: string;
  updated_at: string;
}

export interface ListTemplateHeadersResponse {
  total_count: number;
  headers: Header[];
}

export interface ListTemplateHeadersRequest {
  template_id: string | number;
  payload: ListRequestBody;
}

export interface CostDetails {
  [key: string]: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  cost: CostDetails;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  cost: CostDetails;
}

export interface Attribute {
  [key: string]: string;
}

export interface Item {
  id: string;
  sku: string;
  sku_label: string;
  upc: string | null;
  upc_label: string | null;
  category: string;
  hs_code: string;
  description: string;
  source_type: string;
  attribute: Attribute;
  temp_sku: boolean;
  upload_id: string;
  created_at: string;
  updated_at: string;
  customers: Customer[];
  suppliers: Supplier[];
}

export interface ListItemsResponse {
  items: itemMasterBodyResponseItems[];
  total: number;
}
export interface CreatedBy {
  name: string;
  email: string;
  status: string;
  user_id: string;
  is_admin: boolean;
  tenant_id: string | null;
}

export interface TemplateHeader {
  id: string;
  tenant_id: string;
  label: string;
  name: string;
  is_mandatory: boolean;
  data_type: string;
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
}

export interface ListHeadersResponse {
  total: number;
  headers: TemplateHeader[];
}

export interface HeaderList {
  name: string;
  label: string;
  data_type: string;
}

// delete item master row
export interface DeleteSelectedRowResponse {
  detail: string;
  item_id: string;
  combination_type: string;
}

export interface DeleteSelectedRowPayload {
  item_ids: string[];
}
