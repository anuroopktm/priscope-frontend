import { useAddBulkInsertAdminRequest } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { getEditCellValueAdminApproval } from "../helper";
import { useToastStore } from "@/store/useToastStore";

interface HandleEditAdminParams {
  row: TRow;
  col: string;
  value: string;
  oldValue?: string;
  comment?: string | null;

  itemMasterData: any;
  // itemMasterBulkInsertAdminApproval: any;
  // setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestNotficationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // showToast: (
  //   msg: string,
  //   type?: "success" | "error" | "warning" | "info",
  // ) => void;
}

export const handleEditCellAdminRequest = ({
  row,
  col,
  value,
  comment,
  itemMasterData,
  // itemMasterBulkInsertAdminApproval,
  // setShowLoader,
  setRequestNotficationVisible,
  // showToast,
}: HandleEditAdminParams) => {
  const { mutate: itemMasterBulkInsertAdminApproval } =
    useAddBulkInsertAdminRequest();
  const showToast = useToastStore((state) => state.showToast);

  const item_id = row?.id;

  const allItems =
    itemMasterData?.pages.flatMap((page: any) => page.items) || [];

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

  // setShowLoader(true);

  itemMasterBulkInsertAdminApproval(payload, {
    onSuccess: () => {
      // setShowLoader(false);
      setRequestNotficationVisible(true);
    },
    onError: () => {
      // setShowLoader(false);
      showToast("Failed to save changes. Please try again.", "warning");
    },
  });
};
