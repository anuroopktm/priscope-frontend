import type { TreeGridRow } from "../../helper/types";

export const getDataFromGrid = (Grid: any) => {
  if (!Grid) return [];
  const result = [];
  let row = Grid.GetFirst();
  while (row) {
    if (row.Kind === "Data") {
      const rowData: TreeGridRow = { id: row.id };
      Grid.GetCols().forEach((col: string) => {
        rowData[col] = row![col];
      });
      result.push(rowData);
    }
    row = Grid.GetNext(row);
  }
  return result;
};
