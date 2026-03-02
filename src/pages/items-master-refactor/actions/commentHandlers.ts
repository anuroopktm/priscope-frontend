import { useToastStore } from "@/store/useToastStore";
import { createItemMasterCommentPayload } from "../helper";
import { useCreateItemMasterComment } from "@/services/queries/item-master-refactor/item-master-refactor.queries";

export const useConfirmComment = () => {
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateItemMasterComment();

  const handleConfirmComment = (
    type: string,
    id: string,
    col: string,
    comment: string,
  ) => {
    const payload = createItemMasterCommentPayload(type, col, comment);

    if (!payload) {
      console.error("Invalid comment type");
      return;
    }

    createComment(
      { itemMasterId: id, payload },
      {
        onSuccess: () => {
          showToast("Comment added successfully", "success");
        },
        onError: () => {
          showToast("Failed to add comment", "error");
        },
      },
    );
  };

  return {
    handleConfirmComment,
    isCreatingComment,
  };
};
