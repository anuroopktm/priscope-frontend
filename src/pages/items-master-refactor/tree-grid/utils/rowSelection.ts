import { useItemMasterStore } from "../../store/useItemMasterStore";

export const handleSelected = (grid: TGrid) => {
  const selectedRows = grid?.GetSelRows();
  console.log("selectedRows", selectedRows);
  if (!selectedRows) return;
  const rows = selectedRows.map((r: TRow) => ({
    item_id: r.id,
    SKU: r.SKU,
    UPC: r.UPC,
    Description: r.Description,
    Category: r.Category,
    Size: r.Size,
    "HS Code": r["HS Code"],
    "Customer Cost": r["Customer Cost"],
    "Supplier Cost": r["Supplier Cost"],
    "Supplier Name": r["Supplier Name"],
    "Customer Name": r["Customer Name"],
  }));
  console.log("rows", rows);
  const ids = selectedRows.map((r: TRow) => r.id);
  useItemMasterStore.getState().setSelectedRows(ids);
  useItemMasterStore.getState().setSelectedItems(rows);
};

export const deleteSeletectedRows = (grid: TGrid) => {
  if (!grid) return;
  const rows = grid.GetSelRows();
  grid.DeleteRows(rows, 1);
};
