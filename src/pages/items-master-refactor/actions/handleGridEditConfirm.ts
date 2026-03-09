import { useEditItemMasterItem } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";

export const useHandleGridEditConfirm = () => {
  const queryClient = useQueryClient();
  const { mutate } = useEditItemMasterItem();
  const showToast = useToastStore((state) => state.showToast);

  const handleGridEditConfirm = async ({
    row,
    col,
    value,
    oldValue,
    comment,
    hasEditItemMasterPrivilege,
    confirm,
    gridRef,
    itemMasterData,
    itemMasterBulkInsertAdminApproval,
    setRequestNotficationVisible,
    handleEditCellAdminRequest,
  }: any) => {
    if (value === oldValue) return;

    // No privilege → Admin request flow
    if (!hasEditItemMasterPrivilege) {
      const result = await openConfirmationModal("edit", confirm);

      if (result && handleEditCellAdminRequest) {
        handleEditCellAdminRequest({
          row,
          col,
          value,
          oldValue,
          comment,
          itemMasterData,
          itemMasterBulkInsertAdminApproval,
          // setShowLoader,
          setRequestNotficationVisible,
          showToast,
        });
      } else {
        const Grid = gridRef.current;
        if (Grid) {
          const gridRow = Grid.GetRowById(row.id);
          if (gridRow) Grid.SetValue(gridRow, col, oldValue, 1);
        }
      }
      return;
    }

    // Normal edit flow
    const item_id = row?.id;
    if (!item_id) return;

    const allItems =
      itemMasterData?.pages.flatMap((page: any) => page.items) || [];

    const finalPayload = allItems.find((item: any) => item.id === item_id);
    if (!finalPayload) return;

    if (finalPayload.attributes?.[col]) {
      finalPayload.attributes[col].value = value;
    } else if (
      typeof finalPayload[col] === "object" &&
      finalPayload[col]?.value !== undefined
    ) {
      finalPayload[col].value = value;
    } else {
      finalPayload[col] = value;
    }

    const commentsPayload =
      comment && comment.trim().length > 0
        ? [{ comment_type: "field", item_field_key: col, comment }]
        : undefined;

    const finalPayloadWithMetadata = {
      data: finalPayload,
      comments: commentsPayload,
    };

    // setShowLoader(true);

    mutate(
      { item_id, payload: finalPayloadWithMetadata },
      {
        onSuccess: () => {
          // setShowLoader(false);
          showToast?.("Item updated successfully!", "success");
          queryClient.invalidateQueries({ queryKey: ["item-master-history"] });
        },
        onError: (error) => {
          // setShowLoader(false);
          showToast?.(
            getErrorMessage(error, "Failed to save changes. Please try again."),
            "error",
          );
        },
      },
    );
  };

  return { handleGridEditConfirm };
};
