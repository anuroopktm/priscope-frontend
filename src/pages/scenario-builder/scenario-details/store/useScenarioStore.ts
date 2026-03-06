import { create } from "zustand";

interface ActiveCell {
  rowId: string;
  col: string;
  items?: any[];
  type?: string;
}

interface ScenarioStoreState {
  // Items Master Drawer
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;

  // Group Modal
  isGroupModalOpen: boolean;
  setIsGroupModalOpen: (isOpen: boolean) => void;
  itemsToGroup: any[];
  setItemsToGroup: (items: any[]) => void;

  // Edit Group Modal
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  editingGroupId: string | null;
  setEditingGroupId: (id: string | null) => void;
  editingGroupName: string;
  setEditingGroupName: (name: string) => void;

  // Aggregator Modals
  isComponentAggregatorOpen: boolean;
  setIsComponentAggregatorOpen: (isOpen: boolean) => void;
  isCostAggregatorOpen: boolean;
  setIsCostAggregatorOpen: (isOpen: boolean) => void;
  activeColumn: string | null;
  setActiveColumn: (col: string | null) => void;

  // Margin/Markup Modal
  isMarginMarkupModalOpen: boolean;
  setIsMarginMarkupModalOpen: (isOpen: boolean) => void;
  marginMarkupType: "Margin" | "Markup";
  setMarginMarkupType: (type: "Margin" | "Markup") => void;

  // Aggregator Drawers
  isAggregatorDrawerOpen: boolean;
  setIsAggregatorDrawerOpen: (isOpen: boolean) => void;
  activeCell: ActiveCell | null;
  setActiveCell: (cell: ActiveCell | null) => void;

  // Delete Modal
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  rowToDeleteId: string | null;
  setRowToDeleteId: (id: string | null) => void;

  // Inline Comment Popover
  isCommentPopoverOpen: boolean;
  setIsCommentPopoverOpen: (isOpen: boolean) => void;
  commentCell: { rowId: string; col: string; rect?: DOMRect } | null;
  setCommentCell: (
    cell: { rowId: string; col: string; rect?: DOMRect } | null,
  ) => void;
}

export const useScenarioStore = create<ScenarioStoreState>((set) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

  isGroupModalOpen: false,
  setIsGroupModalOpen: (isOpen) => set({ isGroupModalOpen: isOpen }),
  itemsToGroup: [],
  setItemsToGroup: (items) => set({ itemsToGroup: items }),

  isEditModalOpen: false,
  setIsEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  editingGroupId: null,
  setEditingGroupId: (id) => set({ editingGroupId: id }),
  editingGroupName: "",
  setEditingGroupName: (name) => set({ editingGroupName: name }),

  isComponentAggregatorOpen: false,
  setIsComponentAggregatorOpen: (isOpen) =>
    set({ isComponentAggregatorOpen: isOpen }),
  isCostAggregatorOpen: false,
  setIsCostAggregatorOpen: (isOpen) => set({ isCostAggregatorOpen: isOpen }),
  activeColumn: null,
  setActiveColumn: (col) => set({ activeColumn: col }),

  isMarginMarkupModalOpen: false,
  setIsMarginMarkupModalOpen: (isOpen) =>
    set({ isMarginMarkupModalOpen: isOpen }),
  marginMarkupType: "Margin",
  setMarginMarkupType: (type) => set({ marginMarkupType: type }),

  isAggregatorDrawerOpen: false,
  setIsAggregatorDrawerOpen: (isOpen) =>
    set({ isAggregatorDrawerOpen: isOpen }),
  activeCell: null,
  setActiveCell: (cell) => set({ activeCell: cell }),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
  rowToDeleteId: null,
  setRowToDeleteId: (id) => set({ rowToDeleteId: id }),

  isCommentPopoverOpen: false,
  setIsCommentPopoverOpen: (isOpen) => set({ isCommentPopoverOpen: isOpen }),
  commentCell: null,
  setCommentCell: (cell) => set({ commentCell: cell }),
}));
