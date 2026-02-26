import { useCallback } from "react";
import type { TreeGridState } from "../types/types";

interface UseHandleEditPopoverProps {
  state: TreeGridState;
  comment: string;
  setState: React.Dispatch<React.SetStateAction<TreeGridState>>;
  setCommentAdded: React.Dispatch<React.SetStateAction<boolean>>;
  gridInstance: React.MutableRefObject<TGrid | null>;
  onCellEditConfirm?: (
    row: TRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string,
  ) => void;
}

export const useHandleEditPopover = ({
  state,
  comment,
  setState,
  setCommentAdded,
  gridInstance,
  onCellEditConfirm,
}: UseHandleEditPopoverProps) => {
  const handleEditSave = useCallback(() => {
    if (!state.changedCell) return;
    if (comment.trim().length === 0) return;

    const { row, col, value, oldValue } = state.changedCell;

    onCellEditConfirm?.(row, col, value, oldValue, comment);

    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));

    setCommentAdded(false);
  }, [state, comment, onCellEditConfirm]);

  const handleEditCancel = useCallback(() => {
    if (!state.changedCell) return;

    const { row, col, oldValue } = state.changedCell;
    const Grid = gridInstance.current;

    if (Grid) {
      const gridRow = Grid.GetRowById(row.id);
      if (gridRow) Grid.SetValue(gridRow, col, oldValue, 1);
    }

    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
  }, [state, gridInstance]);

  return { handleEditSave, handleEditCancel };
};
