import { create } from "zustand";
import type { OpenPanel } from "../../items-master-refactor/types/types";

interface ItemsMasterUIStore {
  searchQuery: string;
  filter: Record<string, string[]>;
  showLoader: boolean;
  selectedRows: string[];
  selectedExport: boolean;
  openPanel: OpenPanel;
  detailedViewId: string;
  isDetailViewModalOpen: boolean;
  showFilesModal: boolean;
  showUploadFlow: boolean;
  requestSuccessNotficationVisible: boolean;
  openRequestModal: boolean;
  saveFilter: boolean;

  setSearchQuery: (query: string) => void;
  setFilter: (
    filter:
      | Record<string, string[]>
      | ((prev: Record<string, string[]>) => Record<string, string[]>),
  ) => void;
  setShowLoader: (show: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedRows: (rows: string[] | ((prev: string[]) => string[])) => void;
  setSelectedExport: (selected: boolean | ((prev: boolean) => boolean)) => void;
  setOpenPanel: (panel: OpenPanel | ((prev: OpenPanel) => OpenPanel)) => void;
  setDetailedViewId: (id: string) => void;
  setIsDetailViewModalOpen: (
    open: boolean | ((prev: boolean) => boolean),
  ) => void;
  setShowFilesModal: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowUploadFlow: (show: boolean | ((prev: boolean) => boolean)) => void;
  setRequestSuccessNotficationVisible: (
    visible: boolean | ((prev: boolean) => boolean),
  ) => void;
  setOpenRequestModal: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSaveFilter: (save: boolean | ((prev: boolean) => boolean)) => void;

  resetUI: () => void;
}

export const useItemsMasterUIStore = create<ItemsMasterUIStore>((set) => ({
  searchQuery: "",
  filter: {},
  showLoader: false,
  selectedRows: [],
  selectedExport: false,
  openPanel: null,
  detailedViewId: "",
  isDetailViewModalOpen: false,
  showFilesModal: false,
  showUploadFlow: false,
  requestSuccessNotficationVisible: false,
  openRequestModal: false,
  saveFilter: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilter: (filter) =>
    set((state) => ({
      filter: typeof filter === "function" ? filter(state.filter) : filter,
    })),
  setShowLoader: (showLoader) =>
    set((state) => ({
      showLoader:
        typeof showLoader === "function"
          ? showLoader(state.showLoader)
          : showLoader,
    })),
  setSelectedRows: (selectedRows) =>
    set((state) => ({
      selectedRows:
        typeof selectedRows === "function"
          ? selectedRows(state.selectedRows)
          : selectedRows,
    })),
  setSelectedExport: (selectedExport) =>
    set((state) => ({
      selectedExport:
        typeof selectedExport === "function"
          ? selectedExport(state.selectedExport)
          : selectedExport,
    })),
  setOpenPanel: (openPanel) =>
    set((state) => ({
      openPanel:
        typeof openPanel === "function"
          ? openPanel(state.openPanel)
          : openPanel,
    })),
  setDetailedViewId: (detailedViewId) => set({ detailedViewId }),
  setIsDetailViewModalOpen: (isDetailViewModalOpen) =>
    set((state) => ({
      isDetailViewModalOpen:
        typeof isDetailViewModalOpen === "function"
          ? isDetailViewModalOpen(state.isDetailViewModalOpen)
          : isDetailViewModalOpen,
    })),
  setShowFilesModal: (showFilesModal) =>
    set((state) => ({
      showFilesModal:
        typeof showFilesModal === "function"
          ? showFilesModal(state.showFilesModal)
          : showFilesModal,
    })),
  setShowUploadFlow: (showUploadFlow) =>
    set((state) => ({
      showUploadFlow:
        typeof showUploadFlow === "function"
          ? showUploadFlow(state.showUploadFlow)
          : showUploadFlow,
    })),
  setRequestSuccessNotficationVisible: (requestSuccessNotficationVisible) =>
    set((state) => ({
      requestSuccessNotficationVisible:
        typeof requestSuccessNotficationVisible === "function"
          ? requestSuccessNotficationVisible(
              state.requestSuccessNotficationVisible,
            )
          : requestSuccessNotficationVisible,
    })),
  setOpenRequestModal: (openRequestModal) =>
    set((state) => ({
      openRequestModal:
        typeof openRequestModal === "function"
          ? openRequestModal(state.openRequestModal)
          : openRequestModal,
    })),
  setSaveFilter: (saveFilter) =>
    set((state) => ({
      saveFilter:
        typeof saveFilter === "function"
          ? saveFilter(state.saveFilter)
          : saveFilter,
    })),

  resetUI: () =>
    set({
      searchQuery: "",
      filter: {},
      showLoader: false,
      selectedRows: [],
      selectedExport: false,
      openPanel: null,
      detailedViewId: "",
      isDetailViewModalOpen: false,
      showFilesModal: false,
      showUploadFlow: false,
      requestSuccessNotficationVisible: false,
      openRequestModal: false,
      saveFilter: false,
    }),
}));
