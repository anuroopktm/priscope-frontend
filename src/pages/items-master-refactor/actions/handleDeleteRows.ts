import type { DeleteSelectedRowPayload } from "@/pages/items-master-refactor/types/types";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import type { MutateOptions } from "@tanstack/react-query";
import { useItemMasterStore } from "../store/useItemMasterStore";
import { deleteSeletectedRows } from "../tree-grid/utils/rowSelection";

interface HandleDeleteSelectedParams {
  deleteItemMasterRow: (
    payload: DeleteSelectedRowPayload,
    options?: MutateOptions<any, any, DeleteSelectedRowPayload>,
  ) => void;
}

export const handleDeleteSelected = ({
  deleteItemMasterRow,
}: HandleDeleteSelectedParams) => {
  const store = useItemMasterStore.getState();
  const showToast = useToastStore.getState().showToast;
  const { setSelectedRows, selectedRows, gridRef } = store;

  if (!selectedRows || selectedRows.length === 0) return;

  const payload = { item_ids: selectedRows };

  deleteItemMasterRow(payload, {
    onSuccess: () => {
      showToast("Deleted successfully!", "success");
      deleteSeletectedRows(gridRef);
      setSelectedRows([]);
    },
    onError: (error) => {
      showToast(getErrorMessage(error, "Failed to delete rows"), "error");
    },
  });
};
