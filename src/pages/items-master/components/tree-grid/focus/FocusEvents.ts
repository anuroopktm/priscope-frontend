export const focusRow = (grid: TGrid | null, rowId: any) => {
  if (!grid) return;

  const row = grid.Rows?.[rowId];
  if (!row) return;

  setTimeout(() => {
    grid.Focus(row, undefined as any);
  }, 0);
};

export const focusCell = (grid: TGrid | null, rowId: any, col: string) => {
  if (!grid) return;

  const row = grid.Rows?.[rowId];
  if (!row) return;

  setTimeout(() => {
    grid.Focus(row, col);
  }, 0);
};
