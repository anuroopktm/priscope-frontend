export const highlightSkippedRows = (Grid: any) => {
  if (!Grid) return;
  const cols = Grid.GetCols();
  let row = Grid.GetFirst();
  while (row) {
    if (row.__skipped) {
      const nextRow = Grid.GetNext(row);

      cols.forEach((colIndex: number) => {
        Grid.SetBorder(row, colIndex, "2,#d32f2f", 14, 3);

        if (nextRow) {
          Grid.SetBorder(nextRow, colIndex, "2,#d32f2f", 1, 3);
        }
      });
      Grid.RefreshRow(row);
      if (nextRow) Grid.RefreshRow(nextRow);
    }
    row = Grid.GetNext(row);
  }
};
