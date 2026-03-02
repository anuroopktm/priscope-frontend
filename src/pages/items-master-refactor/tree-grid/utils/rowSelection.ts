import { useItemMasterStore } from "../../store/useItemMasterStore";

export const handleSelected = (grid: TGrid) => {
  const selectedRows = grid?.GetSelRows();
  if (!selectedRows) return;
  const ids = selectedRows.map((r: TRow) => r.id);
  useItemMasterStore.getState().setSelectedRows(ids);
};

export const deleteSeletectedRows = (grid: TGrid) => {
  if (!grid) return;
  const rows = grid.GetSelRows();
  grid.DeleteRows(rows, 1);
};
