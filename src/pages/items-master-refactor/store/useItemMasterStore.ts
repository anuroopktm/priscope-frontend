import { create } from "zustand";

interface ItemMasterStore {
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
  selectedExport: boolean;
  setSelectedExport: (value: boolean) => void;
  gridRef: TGrid | null;
  setGridRef: (grid: TGrid | null) => void;
}

export const useItemMasterStore = create<ItemMasterStore>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),

  selectedExport: false,
  setSelectedExport: (value) => set({ selectedExport: value }),

  gridRef: null,
  setGridRef: (grid) => set({ gridRef: grid }),
}));
