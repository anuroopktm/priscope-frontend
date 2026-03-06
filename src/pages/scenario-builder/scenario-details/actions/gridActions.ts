import { useScenarioStore } from "../store/useScenarioStore";

interface GridReference {
  gridId: string;
  processAddItems?: (items: any[], groupName?: string) => void;
  handleEditRowConfirm?: (newName: string, rowId: string | null) => void;
}

export const handleAddItems = (
  { processAddItems }: GridReference,
  items: any[],
  isGroup: boolean,
) => {
  const { setItemsToGroup, setIsDrawerOpen, setIsGroupModalOpen } =
    useScenarioStore.getState();

  if (!items.length) return;

  if (isGroup) {
    setItemsToGroup(items);
    setIsDrawerOpen(false);
    setTimeout(() => setIsGroupModalOpen(true), 100);
  } else {
    if (processAddItems) processAddItems(items);
    setIsDrawerOpen(false);
  }
};

export const handleGroupConfirm = (
  { processAddItems }: GridReference,
  groupName: string,
) => {
  const { itemsToGroup, setItemsToGroup, setIsGroupModalOpen } =
    useScenarioStore.getState();

  if (processAddItems) processAddItems(itemsToGroup, groupName);
  setItemsToGroup([]);
  setIsGroupModalOpen(false);
};

export const handleEditConfirm = (
  { handleEditRowConfirm }: GridReference,
  newName: string,
) => {
  const {
    editingGroupId,
    setEditingGroupId,
    setEditingGroupName,
    setIsEditModalOpen,
  } = useScenarioStore.getState();

  if (handleEditRowConfirm) handleEditRowConfirm(newName, editingGroupId);
  setEditingGroupId(null);
  setEditingGroupName("");
  setIsEditModalOpen(false);
};

export const handleDeleteConfirm = ({ gridId }: GridReference) => {
  const { rowToDeleteId, setRowToDeleteId, setIsDeleteModalOpen } =
    useScenarioStore.getState();

  const grid = (window as any).Grids?.[gridId];
  if (grid && rowToDeleteId) {
    const row = grid.GetRowById(rowToDeleteId);
    if (row) {
      grid.DeleteRow(row, 1);
    }
  }
  setRowToDeleteId(null);
  setIsDeleteModalOpen(false);
};
