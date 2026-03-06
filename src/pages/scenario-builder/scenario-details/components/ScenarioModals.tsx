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
import ComponentAggregatorModal from "./modals/ComponentAggregatorModal";
import CostAggregatorModal from "./modals/CostAggregatorModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import MarginMarkupModal from "./modals/MarginMarkupModal";
import ScenarioCommentPopover from "./modals/ScenarioCommentPopover";

interface ScenarioModalsProps {
  gridId: string;
  processAddItems: (items: any[], groupName?: string) => void;
  handleEditRowConfirm: (newName: string, rowId: string | null) => void;
}

const ScenarioModals = ({
  gridId,
  processAddItems,
  handleEditRowConfirm,
}: ScenarioModalsProps) => {
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
    })),
  );

  const isGroupToDelete = rowToDeleteId?.startsWith("group_");

  const handleAddItemsCb = (items: any[], isGroup: boolean) =>
    handleAddItems({ processAddItems, gridId }, items, isGroup);

  const handleGroupConfirmCb = (groupName: string) =>
    handleGroupConfirm({ processAddItems, gridId }, groupName);

  const handleEditConfirmCb = (newName: string) =>
    handleEditConfirm({ handleEditRowConfirm, gridId }, newName);

  const handleDeleteConfirmCb = () => handleDeleteConfirm({ gridId });

  const handleComponentAggregatorConfirmCb = (data: any) =>
    handleComponentAggregatorConfirm({ gridId }, data);

  const handleCostAggregatorConfirmCb = (data: any) =>
    handleCostAggregatorConfirm({ gridId }, data);

  const handleMarginMarkupConfirmCb = (data: any) =>
    handleMarginMarkupConfirm({ gridId }, data);

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
    </>
  );
};

export default ScenarioModals;
