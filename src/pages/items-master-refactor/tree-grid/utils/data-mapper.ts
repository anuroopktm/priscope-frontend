import type { itemMasterBodyResponseItems } from "../../helper/types";

export const mapItemsToGridRows = (
  items: itemMasterBodyResponseItems[] = [],
) => {
  return items.map((item) => {
    const row: any = {
      id: item.id,
      SKU: item.SKU?.value || "N/A",
      UPC: (item as any).UPC?.value || item.attributes?.UPC?.value || "N/A",
      Category: item.Category?.value || "N/A",
      Description: item.Description?.value || "N/A",
    };
    return row;
  });
};

export const mapItemsToGridBody = (
  items: itemMasterBodyResponseItems[] = [],
) => {
  return {
    Body: [mapItemsToGridRows(items)],
  };
};
