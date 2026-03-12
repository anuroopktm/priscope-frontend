import { useAddBulkInsertAdminRequest } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { getEditCellValueAdminApproval } from "../helper";
import { useToastStore } from "@/store/useToastStore";

export const useHandleEditCellAdminRequest = () => {
  const { mutate: itemMasterBulkInsertAdminApproval } =
    useAddBulkInsertAdminRequest();

  const showToast = useToastStore((state) => state.showToast);

  const handleEditCellAdminRequest = ({
    row,
    col,
    value,
    comment,
    itemMasterData,
    setRequestNotficationVisible,
  }: any) => {
    const item_id = row?.id;

    const allItems =
      itemMasterData?.pages.flatMap((page: any) => page.items) || [];

    const finalPayload = allItems.find((item: any) => item.id === item_id);
    if (!finalPayload) return;

    const oldPayload = structuredClone(finalPayload);

    if (finalPayload.attributes?.[col]) {
      finalPayload.attributes[col].value = value;
    } else {
      finalPayload[col] = value;
    }

    const commentsPayload = comment?.trim()
      ? [
          {
            comment_type: "field",
            item_field_key: col,
            comment,
          },
        ]
      : undefined;

    const payload = getEditCellValueAdminApproval(
      finalPayload,
      oldPayload,
      commentsPayload,
    );

    if (!payload) return;

    itemMasterBulkInsertAdminApproval(payload, {
      onSuccess: () => {
        setRequestNotficationVisible(true);
      },
      onError: () => {
        showToast("Failed to save changes. Please try again.", "warning");
      },
    });
  };

  return { handleEditCellAdminRequest };
};
