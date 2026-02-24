export const handleSelected = (
  grid: TGrid,
  setSelectedRows: (ids: string[]) => void,
) => {
  const selectedRows = grid?.GetSelRows();
  if (!selectedRows) return;
  const ids = selectedRows.map((r: TRow) => r.id);
  setSelectedRows(ids);
};
