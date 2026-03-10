export const handleRightClick = (
  gridId: string,
  contextMenuItems: {
    name: string;
    onClick: (grid: TGrid, row: TRow, col: string) => void;
    visible?: (row: TRow) => boolean;
  }[],
) => {
  return (grid: TGrid, row: TRow, col: string) => {
    if (!grid || grid.id !== gridId || !row || row.Kind !== "Data") {
      return 0;
    }

    const items = contextMenuItems
      .filter((item) => !item.visible || item.visible(row))
      .map((item) => ({
        Name: item.name,
        OnClick: () => item.onClick(grid, row, col),
      }));

    if (!items.length) return 0;

    grid.ShowMenu(row, col, { Items: items });
    return 1;
  };
};
