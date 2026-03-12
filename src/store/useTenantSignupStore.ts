import { create } from "zustand";
import type { TenantSignUpSchema } from "@/validations/auth/tenant-sign-up.validation";

interface TenantTokenInfo {
  email: string;
  tenant_id: string;
  token: string;
}

interface TenantSignupState {
  signupData: TenantSignUpSchema | null;
  tokenInfo: TenantTokenInfo | null;

  setSignupData: (data: TenantSignUpSchema) => void;
  setTokenInfo: (info: TenantTokenInfo) => void;
  clearSignupStore: () => void;
}

export const useTenantSignupStore = create<TenantSignupState>((set) => ({
  signupData: null,
  tokenInfo: null,

  setSignupData: (data) => set({ signupData: data }),

  setTokenInfo: (info) => set({ tokenInfo: info }),

  clearSignupStore: () =>
    set({
      signupData: null,
      tokenInfo: null,
    }),
}));