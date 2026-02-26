import { getEditCellValueAdminApproval } from "../helpers/itemMasterTreeGridHelperFunction";

interface HandleEditAdminParams {
  row: TRow;
  col: string;
  value: string;
  oldValue?: string;
  comment?: string | null;

  itemMasterDataList: any;
  itemMasterBulkInsertAdminApproval: any;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestSuccessNotficationVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showToast: (
    msg: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
}

export const handleEditCellAdminRequest = ({
  row,
  col,
  value,
  comment,
  itemMasterDataList,
  itemMasterBulkInsertAdminApproval,
  setShowLoader,
  setRequestSuccessNotficationVisible,
  showToast,
}: HandleEditAdminParams) => {
  const item_id = row?.id;

  const allItems =
    itemMasterDataList?.pages.flatMap((page: any) => page.items) || [];

  const finalPayload = allItems.find((item: any) => item.id === item_id);
  if (!finalPayload) return;

  const oldPayload = structuredClone(finalPayload);

  if (finalPayload.attributes?.[col]) {
    finalPayload.attributes[col].value = value;
  } else {
    (finalPayload as any)[col] = value;
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

  setShowLoader(true);

  itemMasterBulkInsertAdminApproval(payload, {
    onSuccess: () => {
      setShowLoader(false);
      setRequestSuccessNotficationVisible(true);
    },
    onError: () => {
      setShowLoader(false);
      showToast("Failed to save changes. Please try again.", "warning");
    },
  });
};
