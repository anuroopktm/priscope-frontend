import { create } from "zustand";

interface LoaderStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
