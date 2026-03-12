import { handleRightClick } from "../CellValue/handleRightClick";

export const getRightClickHandlers = (
  gridId: string,
  onClickCellComment: (grid: TGrid, row: TRow, col: string) => void,
) =>
  handleRightClick(gridId, [
    { name: "Comment on this cell", onClick: onClickCellComment },
  ]);
