export const itemMasterColumnToFieldMap: Record<string, string> = {
  SKU: "sku",
  Category: "category",
  Description: "description",
};

export const allowedKeys = [
  "sku",
  "upc",
  "category",
  "description",
  "hs_code",
] as const;
