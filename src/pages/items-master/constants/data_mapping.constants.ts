export const CSV_COLUMNS = [
  "Product_ID",
  "Product_Name",
  "Product_Code",
  "Category_Name",
  "Supplier_Name",
  "Customer_Name",
  "Description",
  "Price",
  "Stock",
  "Brand",
] as const;

export const DATA_TYPES = [
  "Text",
  "Long Text",
  "Numeric",
  "Date",
  "Boolean",
  "Decimal",
] as const;

export const SYSTEM_FIELDS = [
  { key: "SKU", label: "SKU", required: false },
  { key: "UPC", label: "UPC", required: false },
  { key: "Category", label: "Category", required: false },
  { key: "Supplier", label: "Supplier", required: false },
  { key: "Customer", label: "Customer", required: false },
] as const;

export const SAVED_TEMPLATES = [
  "Template 1",
  "Template 2",
  "Product Import Template",
] as const;

export const DATA_MAPPING_STEPS = [
  "Upload File",
  "Set Control Field",
  "System Field Mapping",
  "Attribute Configuration",
] as const;

export const DEFAULT_SYSTEM_FIELD_MAPPING = {
  SKU: "",
  UPC: "",
  Category: "",
  Supplier: "",
  Customer: "",
} as const;

export const DEFAULT_ATTRIBUTE_CONFIGURATION = {
  Description: { dataType: "Long Text", mandatory: true },
  Size: { dataType: "Text", mandatory: true },
  Color: { dataType: "Text", mandatory: true },
  "Fabric Type": { dataType: "Text", mandatory: true },
  "Misc Attribute": { dataType: "Numeric", mandatory: false },
} as const;

export type SystemFieldKey = keyof typeof DEFAULT_SYSTEM_FIELD_MAPPING;
export type DataType = (typeof DATA_TYPES)[number];
export type CSVColumn = (typeof CSV_COLUMNS)[number];
export type SavedTemplate = (typeof SAVED_TEMPLATES)[number];
