import { useItemMasterStore } from "../../store/useItemMasterStore";
const ignoredCols = [
  "Def",
  "Selected",
  "CanSelect",
  "PanelSelect",
  "_DefaultSort",
  "Expanded",
  "Kind",
];
export const handleSelected = (grid: TGrid) => {
  if (!grid) return;
  const selectedRows = grid.GetSelRows();
  if (!selectedRows) return;

  const cols = grid.GetCols();

  const rows = selectedRows.map((r: TRow) => {
    const rowData: any = {
      id: r.id,
    };

    cols.forEach((col: string) => {
      if (r[col] !== undefined && !ignoredCols.includes(col)) {
        rowData[col] = r[col];
      }
    });

    return rowData;
  });

  const ids = selectedRows.map((r: TRow) => r.id);
  useItemMasterStore.getState().setSelectedRows(ids);
  useItemMasterStore.getState().setSelectedItems(rows);
};

export const deleteSeletectedRows = (grid: TGrid) => {
  if (!grid) return;
  const rows = grid.GetSelRows();
  grid.DeleteRows(rows, 1);
};
