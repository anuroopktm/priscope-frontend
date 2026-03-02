import { focusCell, focusRow } from "../tree-grid/focus/focusEvents";
import { useItemMasterStore } from "../store/useItemMasterStore";

export const selectComment = (comment: any) => {
  const gridRef = useItemMasterStore.getState().gridRef;
  const id = comment.item_id;
  if (comment.comment_type === "row") {
    focusRow(gridRef, id);
  } else if (comment.comment_type === "field") {
    const fieldKey = comment.field_key;
    focusCell(gridRef, id, fieldKey);
  }
};
