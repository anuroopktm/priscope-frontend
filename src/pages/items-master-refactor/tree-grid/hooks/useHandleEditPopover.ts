import { useCallback } from "react";
import { useItemMasterStore } from "../../store/useItemMasterStore";

interface UseHandleEditPopoverProps {
  comment: string;
  setCommentAdded: React.Dispatch<React.SetStateAction<boolean>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  gridRef: TGrid | null;
  onCellEditConfirm?: (
    row: TRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string,
  ) => void;
}

export const useHandleEditPopover = ({
  comment,
  setCommentAdded,
  setComment,
  gridRef,
  onCellEditConfirm,
}: UseHandleEditPopoverProps) => {
  const changedCell = useItemMasterStore((state) => state.changedCell);
  const closeSavePopover = useItemMasterStore(
    (state) => state.closeSavePopover,
  );

  const handleEditSave = useCallback(() => {
    if (!changedCell || comment.trim().length === 0) return;

    const { row, col, value, oldValue } = changedCell;
    if (gridRef) {
      const gridRow = gridRef.GetRowById(row.id);
      if (gridRow) gridRef.SetValue(gridRow, col, value, 1);
    }
    onCellEditConfirm?.(row, col, value, oldValue, comment);

    closeSavePopover();
    setCommentAdded(false);
    setComment("");
  }, [
    changedCell,
    comment,
    onCellEditConfirm,
    closeSavePopover,
    setCommentAdded,
    setComment,
  ]);

  const handleEditCancel = useCallback(() => {
    if (!changedCell) return;

    const { row, col, oldValue } = changedCell;

    if (gridRef) {
      const gridRow = gridRef.GetRowById(row.id);
      if (gridRow) gridRef.SetValue(gridRow, col, oldValue, 1);
    }

    closeSavePopover();
    setCommentAdded(false);
    setComment("");
  }, [changedCell, gridRef, closeSavePopover, setCommentAdded, setComment]);

  return { handleEditSave, handleEditCancel };
};
