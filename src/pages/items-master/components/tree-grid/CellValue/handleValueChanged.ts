import React from "react";

export interface GridUIState {
  showSavePopover: boolean;
  popoverPosition: { top: number; left: number };
  changedCell: any;
}

export const handleValueChanged = (
  grid: TGrid,
  row: TRow,
  col: string,
  val: any,
  oldval: any,
  gridId: string,
  // enableEditPopover: boolean,
  setState: React.Dispatch<React.SetStateAction<GridUIState>>,
): void => {
  const isFilterRow = row?.Def?.Name === "Filter";
  if (
    grid?.id !== gridId ||
    oldval === val ||
    // !enableEditPopover ||
    isFilterRow
  )
    return;

  const cellElement = grid.GetCell(row, col);
  if (!cellElement) return;

  const rect = cellElement.getBoundingClientRect();

  setState({
    showSavePopover: true,
    popoverPosition: {
      top: rect.bottom - 130 + window.scrollY,
      left: rect.left - 80 + window.scrollX,
    },
    changedCell: {
      row,
      col,
      value: val,
      oldValue: oldval,
    },
  });
};
