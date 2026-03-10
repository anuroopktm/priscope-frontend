import { useCreateItemGroup } from "@/services/queries/common/common.queries";
import { useCreateScenarioComment } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import {
  handleComponentAggregatorConfirm,
  handleCostAggregatorConfirm,
  handleMarginMarkupConfirm,
} from "../actions/aggregatorHandlers";
import {
  handleAddItems,
  handleDeleteConfirm,
  handleEditConfirm,
  handleGroupConfirm,
} from "../actions/gridActions";
import { useScenarioStore } from "../store/useScenarioStore";
import ItemsMasterDrawer from "./items-master-drawer/ItemsMasterDrawer";
import AddAsGroupModal from "./items-master-drawer/components/AddAsGroupModal";
import CommentModal from "./modals/CommentModal";
import ComponentAggregatorModal from "./modals/ComponentAggregatorModal";
import CostAggregatorModal from "./modals/CostAggregatorModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import MarginMarkupModal from "./modals/MarginMarkupModal";
import ScenarioCommentPopover from "./modals/ScenarioCommentPopover";

interface ScenarioModalsProps {
  gridId: string;
  processAddItems: (
    items: any[],
    groupName?: string,
    selectedHeaders?: string[],
  ) => void;
  handleEditRowConfirm: (newName: string, rowId: string | null) => void;
  handleDeleteRowConfirm: (rowId: string) => void;
}

const ScenarioModals = ({
  gridId,
  processAddItems,
  handleEditRowConfirm,
  handleDeleteRowConfirm,
}: ScenarioModalsProps) => {
  const { id: scenarioId } = useParams<{ id: string }>();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: addComment, isPending: isAddingComment } =
    useCreateScenarioComment();
  const { mutate: createItemGroup, isPending: isCreatingGroup } =
    useCreateItemGroup();

  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isGroupModalOpen,
    setIsGroupModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingGroupName,
    isComponentAggregatorOpen,
    setIsComponentAggregatorOpen,
    isCostAggregatorOpen,
    setIsCostAggregatorOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    rowToDeleteId,
    isMarginMarkupModalOpen,
    setIsMarginMarkupModalOpen,
    marginMarkupType,
    isCommentModalOpen,
    setIsCommentModalOpen,
    commentModalCell,
    setCommentModalCell,
    itemsToGroup,
  } = useScenarioStore(
    useShallow((state) => ({
      isDrawerOpen: state.isDrawerOpen,
      setIsDrawerOpen: state.setIsDrawerOpen,
      isGroupModalOpen: state.isGroupModalOpen,
      setIsGroupModalOpen: state.setIsGroupModalOpen,
      isEditModalOpen: state.isEditModalOpen,
      setIsEditModalOpen: state.setIsEditModalOpen,
      editingGroupName: state.editingGroupName,
      isComponentAggregatorOpen: state.isComponentAggregatorOpen,
      setIsComponentAggregatorOpen: state.setIsComponentAggregatorOpen,
      isCostAggregatorOpen: state.isCostAggregatorOpen,
      setIsCostAggregatorOpen: state.setIsCostAggregatorOpen,
      isDeleteModalOpen: state.isDeleteModalOpen,
      setIsDeleteModalOpen: state.setIsDeleteModalOpen,
      rowToDeleteId: state.rowToDeleteId,
      isMarginMarkupModalOpen: state.isMarginMarkupModalOpen,
      setIsMarginMarkupModalOpen: state.setIsMarginMarkupModalOpen,
      marginMarkupType: state.marginMarkupType,
      isCommentModalOpen: state.isCommentModalOpen,
      setIsCommentModalOpen: state.setIsCommentModalOpen,
      commentModalCell: state.commentModalCell,
      setCommentModalCell: state.setCommentModalCell,
      itemsToGroup: state.itemsToGroup,
    })),
  );

  const isGroupToDelete = rowToDeleteId?.startsWith("group_");

  const handleAddItemsCb = (
    items: any[],
    isGroup: boolean,
    selectedHeaders: string[],
  ) =>
    handleAddItems(
      { processAddItems, gridId },
      items,
      isGroup,
      selectedHeaders,
    );

  const handleGroupConfirmCb = (groupName: string) => {
    const itemIds = itemsToGroup.map((item: any) => item.id).filter(Boolean);

    createItemGroup(
      {
        name: groupName,
        description: `Group created for ${groupName}`,
        item_ids: itemIds,
      },
      {
        onSuccess: (response: any) => {
          showToast(
            response.message || "Group created successfully",
            "success",
          );
          handleGroupConfirm({ processAddItems, gridId }, groupName);
        },
        onError: (error: any) => {
          showToast(getErrorMessage(error, "Failed to create group"), "error");
        },
      },
    );
  };

  const handleEditConfirmCb = (newName: string) =>
    handleEditConfirm({ handleEditRowConfirm, gridId }, newName);

  const handleDeleteConfirmCb = () =>
    handleDeleteConfirm({ gridId, handleDeleteRowConfirm });

  const handleComponentAggregatorConfirmCb = (data: any) =>
    handleComponentAggregatorConfirm({ gridId }, data);

  const handleCostAggregatorConfirmCb = (data: any) =>
    handleCostAggregatorConfirm({ gridId }, data);

  const handleMarginMarkupConfirmCb = (data: any) =>
    handleMarginMarkupConfirm({ gridId }, data);

  const handleCommentModalConfirm = (comment: string) => {
    if (!scenarioId || !commentModalCell) return;

    addComment(
      {
        scenario_id: scenarioId,
        payload: {
          cell_ref: `${commentModalCell.rowId}:${commentModalCell.col}`,
          comment: comment.trim(),
        },
      },
      {
        onSuccess: () => {
          showToast("Comment added successfully", "success");
          setIsCommentModalOpen(false);
          setCommentModalCell(null);
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to add comment"), "error");
        },
      },
    );
  };

  return (
    <>
      <ItemsMasterDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddItems={handleAddItemsCb}
      />

      <AddAsGroupModal
        open={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={handleGroupConfirmCb}
        isLoading={isCreatingGroup}
      />

      <AddAsGroupModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirmCb}
        title="Edit Group"
        initialValue={editingGroupName}
        confirmLabel="Save"
      />

      <ComponentAggregatorModal
        open={isComponentAggregatorOpen}
        onClose={() => setIsComponentAggregatorOpen(false)}
        onConfirm={handleComponentAggregatorConfirmCb}
      />

      <CostAggregatorModal
        open={isCostAggregatorOpen}
        onClose={() => setIsCostAggregatorOpen(false)}
        onConfirm={handleCostAggregatorConfirmCb}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmCb}
        title={isGroupToDelete ? "Delete Group" : "Delete Item"}
        message={
          isGroupToDelete
            ? "Are you sure you want to delete this group and all items within it? This action cannot be undone."
            : "Are you sure you want to delete this item? This action cannot be undone."
        }
      />

      <MarginMarkupModal
        open={isMarginMarkupModalOpen}
        onClose={() => setIsMarginMarkupModalOpen(false)}
        onConfirm={handleMarginMarkupConfirmCb}
        type={marginMarkupType}
      />

      <ScenarioCommentPopover />

      <CommentModal
        open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onConfirm={handleCommentModalConfirm}
        isLoading={isAddingComment}
      />
    </>
  );
};

export default ScenarioModals;
