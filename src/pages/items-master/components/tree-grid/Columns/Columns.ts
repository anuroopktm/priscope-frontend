export const addColumn = (grid: TGrid | null, columnName: string) => {
  if (!grid) return;

  const colCaption = columnName;
  const section = 1;
  const position = -1;
  const params = {
    Width: 150,
    Type: "Text",
    CanSort: 1,
    CanEdit: 1,
  };
  const show = 1;
  const type = "Text";

  grid.AddCol(columnName, section, position, params, show, type, colCaption);
};

export const hideColumn = (grid: TGrid | null, column: string) => {
  if (!grid) return;
  grid.HideCol(column);
};

export const showColumn = (grid: TGrid | null, column: string) => {
  if (!grid) return;
  grid.ShowCol(column);
};

export const deleteColumn = (grid: TGrid | null, column: string) => {
  if (!grid) return;
  grid.RemoveCol(column);
};
