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

  // Comment Modal (from context menu)
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: (isOpen: boolean) => void;
  commentModalCell: { rowId: string; col: string } | null;
  setCommentModalCell: (cell: { rowId: string; col: string } | null) => void;

  // Comments Sidebar
  isCommentsSidebarOpen: boolean;
  setIsCommentsSidebarOpen: (isOpen: boolean) => void;

  // Item Master Headers
  itemMasterSelectedHeaders: string[];
  setItemMasterSelectedHeaders: (headers: string[]) => void;
}

export const useScenarioStore = create<ScenarioStoreState>((set) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen: boolean) => set({ isDrawerOpen: isOpen }),

  isGroupModalOpen: false,
  setIsGroupModalOpen: (isOpen: boolean) => set({ isGroupModalOpen: isOpen }),
  itemsToGroup: [],
  setItemsToGroup: (items: any[]) => set({ itemsToGroup: items }),

  isEditModalOpen: false,
  setIsEditModalOpen: (isOpen: boolean) => set({ isEditModalOpen: isOpen }),
  editingGroupId: null,
  setEditingGroupId: (id: string | null) => set({ editingGroupId: id }),
  editingGroupName: "",
  setEditingGroupName: (name: string) => set({ editingGroupName: name }),

  isComponentAggregatorOpen: false,
  setIsComponentAggregatorOpen: (isOpen: boolean) =>
    set({ isComponentAggregatorOpen: isOpen }),
  isCostAggregatorOpen: false,
  setIsCostAggregatorOpen: (isOpen: boolean) =>
    set({ isCostAggregatorOpen: isOpen }),
  activeColumn: null,
  setActiveColumn: (col: string | null) => set({ activeColumn: col }),

  isMarginMarkupModalOpen: false,
  setIsMarginMarkupModalOpen: (isOpen: boolean) =>
    set({ isMarginMarkupModalOpen: isOpen }),
  marginMarkupType: "Margin",
  setMarginMarkupType: (type: "Margin" | "Markup") =>
    set({ marginMarkupType: type }),

  isAggregatorDrawerOpen: false,
  setIsAggregatorDrawerOpen: (isOpen: boolean) =>
    set({ isAggregatorDrawerOpen: isOpen }),
  activeCell: null,
  setActiveCell: (cell: ActiveCell | null) => set({ activeCell: cell }),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen: boolean) => set({ isDeleteModalOpen: isOpen }),
  rowToDeleteId: null,
  setRowToDeleteId: (id: string | null) => set({ rowToDeleteId: id }),

  isCommentPopoverOpen: false,
  setIsCommentPopoverOpen: (isOpen: boolean) =>
    set({ isCommentPopoverOpen: isOpen }),
  commentCell: null,
  setCommentCell: (
    cell: { rowId: string; col: string; rect?: DOMRect } | null,
  ) => set({ commentCell: cell }),

  isCommentModalOpen: false,
  setIsCommentModalOpen: (isOpen: boolean) =>
    set({ isCommentModalOpen: isOpen }),
  commentModalCell: null,
  setCommentModalCell: (cell: { rowId: string; col: string } | null) =>
    set({ commentModalCell: cell }),

  isCommentsSidebarOpen: false,
  setIsCommentsSidebarOpen: (isOpen: boolean) =>
    set({ isCommentsSidebarOpen: isOpen }),

  itemMasterSelectedHeaders: [],
  setItemMasterSelectedHeaders: (headers: string[]) =>
    set({ itemMasterSelectedHeaders: headers }),
}));
