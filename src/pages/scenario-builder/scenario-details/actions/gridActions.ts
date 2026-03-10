import { useScenarioStore } from "../store/useScenarioStore";

interface GridReference {
  gridId: string;
  processAddItems?: (
    items: any[],
    groupName?: string,
    selectedHeaders?: string[],
  ) => void;
  handleEditRowConfirm?: (newName: string, rowId: string | null) => void;
  handleDeleteRowConfirm?: (rowId: string) => void;
}

export const handleAddItems = (
  { processAddItems }: GridReference,
  items: any[],
  isGroup: boolean,
  selectedHeaders: string[],
) => {
  const {
    setItemsToGroup,
    setIsDrawerOpen,
    setIsGroupModalOpen,
    setItemMasterSelectedHeaders,
  } = useScenarioStore.getState();

  if (!items.length) return;

  if (isGroup) {
    setItemsToGroup(items);
    setItemMasterSelectedHeaders(selectedHeaders);
    setIsDrawerOpen(false);
    setTimeout(() => setIsGroupModalOpen(true), 100);
  } else {
    if (processAddItems) processAddItems(items, undefined, selectedHeaders);
  }
};

export const handleGroupConfirm = (
  { processAddItems }: GridReference,
  groupName: string,
) => {
  const {
    itemsToGroup,
    setItemsToGroup,
    setIsGroupModalOpen,
    itemMasterSelectedHeaders,
    setItemMasterSelectedHeaders,
  } = useScenarioStore.getState();

  if (processAddItems) {
    processAddItems(itemsToGroup, groupName, itemMasterSelectedHeaders);
  }
  setItemsToGroup([]);
  setItemMasterSelectedHeaders([]);
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

export const handleDeleteConfirm = ({
  gridId,
  handleDeleteRowConfirm,
}: GridReference) => {
  const { rowToDeleteId, setRowToDeleteId, setIsDeleteModalOpen } =
    useScenarioStore.getState();

  const grid = (window as any).Grids?.[gridId];
  if (grid && rowToDeleteId) {
    if (handleDeleteRowConfirm) {
      handleDeleteRowConfirm(rowToDeleteId);
    } else {
      const row = grid.GetRowById(rowToDeleteId);
      if (row) {
        grid.DeleteRow(row, 1);
      }
    }
  }
  setRowToDeleteId(null);
  setIsDeleteModalOpen(false);
};
