import { create } from "zustand";

export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

interface ToastStore {
  toast: ToastState;
  showToast: (message: string, severity?: ToastSeverity) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: {
    open: false,
    message: "",
    severity: "success",
  },
  showToast: (message, severity = "success") =>
    set({
      toast: {
        open: true,
        message,
        severity,
      },
    }),
  hideToast: () =>
    set((state) => ({
      toast: {
        ...state.toast,
        open: false,
      },
    })),
}));
