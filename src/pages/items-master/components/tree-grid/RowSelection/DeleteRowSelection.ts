export const deleteSeletectedRows = (grid: TGrid) => {
  if (!grid) return;
  const rows = grid.GetSelRows();
  grid.DeleteRows(rows, 1);
};
