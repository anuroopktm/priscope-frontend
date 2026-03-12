import { useItemMasterStore } from "../../store/useItemMasterStore";

export const handleValueChanged = (
  grid: TGrid,
  row: TRow,
  col: string,
  val: any,
  oldval: any,
  gridId: string,
): void => {
  const isFilterRow = row?.Def?.Name === "Filter";
  const { openSavePopover } = useItemMasterStore.getState();

  if (grid?.id !== gridId || String(oldval) === String(val) || isFilterRow)
    return;
  grid.SetValue(row, col, val, 1);
  grid.RefreshRow(row);

  const cellElement = grid.GetCell(row, col);
  if (!cellElement) return;

  const rect = cellElement.getBoundingClientRect();

  openSavePopover(
    {
      top: rect.bottom - 130 + window.scrollY,
      left: rect.left - 80 + window.scrollX,
    },
    {
      row,
      col,
      value: val,
      oldValue: oldval,
    },
  );
};
