import { create } from "zustand";
import type {
  Header,
  SelectedField,
} from "../types/types";

interface ItemMasterStore {
  headers: string[];
  selected: SelectedField[];
  uploadId: string | null;
  tableHeaders: Header[];
  controlFields: SelectedField[];

  setHeaders: (headers: string[]) => void;
  setSelected: (key: string, value: string, field: string) => void;
  setUploadId: (uploadId: string) => void;
  setTableHeaders: (tableHeaders: Header[]) => void;
  setControlFields: (key: string, value: string) => void;

  getAvailableHeaders: (fieldName: string) => string[];
  clearFields: (fieldsToClear: string[]) => void;
  reset: () => void;
}

export const useItemMasterStore = create<ItemMasterStore>((set, get) => ({
  headers: [],
  selected: [],
  uploadId: null,
  tableHeaders: [],
  controlFields: [],

  setHeaders: (headers) => set({ headers }),

  setSelected: (key, value, field) =>
    set((state) => {
      const updatedSelected = state.selected.filter((item) => item.key !== key);
      if (value) {
        updatedSelected.push({ key, value, field });
      }
      return { selected: updatedSelected };
    }),

  setControlFields: (key, value) =>
    set((state) => {
      const currentFields = state.controlFields.filter(
        (item) => item.key !== key,
      );
      if (value) {
        currentFields.push({ key, value });
      }
      return { controlFields: currentFields };
    }),

  setUploadId: (uploadId) => {
    console.log("Setting upload ID in store:", uploadId);
    set({ uploadId });
  },

  setTableHeaders: (tableHeaders) => set({ tableHeaders }),

  getAvailableHeaders: (fieldName) => {
    const { headers, selected } = get();
    return headers.filter(
      (h) =>
        !selected.some((item) => item.key !== fieldName && item.value === h),
    );
  },

  clearFields: (fieldsToClear) => {
    const { selected } = get();
    const filtered = selected.filter(
      (item) => !fieldsToClear.includes(item.key),
    );
    set({ selected: filtered });
  },

  //resetting store
  reset: () => {
    set({
      headers: [],
      selected: [],
      uploadId: null,
    });
  },
}));
