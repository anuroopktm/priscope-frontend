export const Field_Map: Record<string, string> = {
  SKU: "sku",
  UPC: "upc",
  Category: "category",
  Description: "description",
  "HS Code": "hscode",
  Size: "size",
  Supplier: "supplier",
  Customer: "customer",
};

export const page_size_item_master = 50;

export const allowedKeys = ["sku", "upc", "category", "description", "hs_code"] as const;
