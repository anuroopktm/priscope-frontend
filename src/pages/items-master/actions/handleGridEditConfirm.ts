
import { useEditItemMasterItem } from "@/services/queries/item-master/item-master.queries";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";

export const useHandleGridEditConfirm = () => {
  const queryClient = useQueryClient();
  const { mutate } = useEditItemMasterItem();

  const handleGridEditConfirm = async ({
    row,
    col,
    value,
    oldValue,
    comment,
    hasEditItemMasterPrivilege,
    confirm,
    gridInstance,
    itemMasterDataList,
    itemMasterBulkInsertAdminApproval,
    setShowLoader,
    setRequestSuccessNotficationVisible,
    showToast,
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
          itemMasterDataList,
          itemMasterBulkInsertAdminApproval,
          setShowLoader,
          setRequestSuccessNotficationVisible,
          showToast,
        });
      } else {
        const Grid = gridInstance.current;
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
      itemMasterDataList?.pages.flatMap((page: any) => page.items) || [];

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

    setShowLoader(true);

    mutate(
      { item_id, payload: finalPayloadWithMetadata },
      {
        onSuccess: () => {
          setShowLoader(false);
          showToast?.("Item updated successfully!", "success");
          queryClient.invalidateQueries({ queryKey: ["item-master-history"] });
        },
        onError: () => {
          setShowLoader(false);
          showToast?.("Failed to save changes. Please try again.", "warning");
        },
      }
    );
  };

  return { handleGridEditConfirm };
};