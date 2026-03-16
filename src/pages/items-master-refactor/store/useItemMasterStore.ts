import { create } from "zustand";
type ScenarioItem = {
  item_id: string;
  SKU: string;
  UPC: string;
  Description: string;
  Category: string;
  Size: string;
  "HS Code": string | number;
  "Customer Cost": number;
  "Supplier Cost": number;
  "Supplier Name": string;
  "Customer Name": string;
};
interface ItemMasterStore {
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
  clearSelectedRows: () => void;
  selectedExport: boolean;
  setSelectedExport: (value: boolean) => void;
  gridRef: TGrid | null;
  setGridRef: (grid: TGrid | null) => void;
  filter: Record<string, string[]>;
  setFilter: (filter: Record<string, string[]>) => void;
  checkBoxList: Record<string, boolean>;
  setCheckBoxList: (
    checkBoxList:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
  showSavePopover: boolean;
  popoverPosition: { top: number; left: number };
  changedCell: {
    row: TRow;
    col: string;
    value: any;
    oldValue: any;
  } | null;

  openSavePopover: (
    position: { top: number; left: number },
    cell: { row: TRow; col: string; value: any; oldValue: any },
  ) => void;
  closeSavePopover: () => void;

  selectedItems: ScenarioItem[];
  setSelectedItems: (items: ScenarioItem[]) => void;
  clearSelectedItems: () => void;
}

export const useItemMasterStore = create<ItemMasterStore>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),
  clearSelectedRows: () => set({ selectedRows: [] }),

  selectedExport: false,
  setSelectedExport: (value) => set({ selectedExport: value }),

  gridRef: null,
  setGridRef: (grid) => set({ gridRef: grid }),

  filter: {},
  setFilter: (filter) => set({ filter }),

  checkBoxList: {},
  setCheckBoxList: (update) =>
    set((state) => ({
      checkBoxList:
        typeof update === "function" ? update(state.checkBoxList) : update,
    })),

  showSavePopover: false,
  popoverPosition: { top: 0, left: 0 },
  changedCell: null,

  openSavePopover: (position, cell) =>
    set({
      showSavePopover: true,
      popoverPosition: position,
      changedCell: cell,
    }),

  closeSavePopover: () =>
    set({
      showSavePopover: false,
      popoverPosition: { top: 0, left: 0 },
      changedCell: null,
    }),

  selectedItems: [],
  setSelectedItems: (items) => set({ selectedItems: items }),
  clearSelectedItems: () => set({ selectedItems: [] }),
}));
