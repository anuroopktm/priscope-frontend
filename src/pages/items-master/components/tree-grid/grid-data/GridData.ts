  const getDataFromTable = (grid:TGrid) => {
    if (!grid) return [];
    const Grid = grid;
    const result = [];
    let row = Grid.GetFirst();
    while (row) {
      if (row.Kind === "Data") {
        const rowData = { id: row.id };
        Grid.GetCols().forEach((col: string) => {
          rowData[col] = row![col];
        });
        result.push(rowData);
      }
      row = Grid.GetNext(row);
    }
    return result;
  };