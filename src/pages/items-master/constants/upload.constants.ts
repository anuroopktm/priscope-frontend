export type ControlFields = {
  item: string;
  supplier: string;
  customer: string;
};

export type UploadedFile = {
  name: string;
  size: string;
  file: File;
};

export type CsvTypeOption = {
  value: string;
  label: string;
  fields: string[];
};

export const CSV_COLUMNS = [
  "SKU_csv_1",
  "SKU_Supplier_1",
  "SKU_Customer_1",
  "Product_Name",
  "Price",
  "Quantity",
];

export const CSV_TYPE_OPTIONS: CsvTypeOption[] = [
  { value: "item", label: "Only Items", fields: ["item"] },
  {
    value: "item+supplier",
    label: "Supplier + items",
    fields: ["item", "supplier"],
  },
  {
    value: "item+customer",
    label: "Customer + items",
    fields: ["item", "customer"],
  },
  {
    value: "item+supplier+customer",
    label: "Supplier + Customer + items",
    fields: ["item", "supplier", "customer"],
  },
];

export const UPLOAD_STEPS = [
  "Upload File",
  "Set Control Field",
  "System Field Mapping",
  "Attribute Configuration",
];

export const ACCEPTED_FILE_TYPES = ".csv,.xlsx,.xls";

export const isValidFileType = (file: File): boolean => {
  return (
    file.type === "text/csv" ||
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls")
  );
};

export const CONTROL_FIELDS = {
  ITEM: "item",
  SUPPLIER: "supplier",
  CUSTOMER: "customer",
};
