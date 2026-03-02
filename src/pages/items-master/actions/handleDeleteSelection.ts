import type { DeleteSelectedRowPayload } from "../../items-master-refactor/types/types";

interface HandleDeleteSelectionProps {
  selectedRows: string[];
  deleteItemMasterRow: any;
  gridInstance: React.RefObject<any>;
  setSelectedRows: (rows: string[]) => void;
  setShowLoader: (v: boolean) => void;
  showToast: (msg: string, type?: any) => void;
}

export const handleDeleteSelection = ({
  selectedRows,
  deleteItemMasterRow,
  gridInstance,
  setSelectedRows,
  setShowLoader,
  showToast,
}: HandleDeleteSelectionProps) => {
  if (!selectedRows || selectedRows.length === 0) return;

  const payload: DeleteSelectedRowPayload = { item_ids: selectedRows };
  setShowLoader(true);

  deleteItemMasterRow(payload, {
    onSuccess: () => {
      setShowLoader(false);
      showToast("Deleted successfully!", "success");

      if (gridInstance.current) {
        gridInstance.current.DeleteSelRows?.();
      }

      setSelectedRows([]);
    },
    onError: () => {
      showToast("Failed to delete rows", "error");
      setShowLoader(false);
    },
  });
};
