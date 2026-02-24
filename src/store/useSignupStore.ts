import type { SignUpFormData } from "@/validations/auth/sign-up.validation";
import { create } from "zustand";

interface TokenInfo {
  email: string;
  tenant_id: string;
  token: string;
}

interface SignupState {
  signupData: SignUpFormData | null;
  tokenInfo: TokenInfo | null;
  setSignupData: (data: SignUpFormData) => void;
  setTokenInfo: (info: TokenInfo) => void;
  clearSignupStore: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  signupData: null,
  tokenInfo: null,
  setSignupData: (data) => set({ signupData: data }),
  setTokenInfo: (info) => set({ tokenInfo: info }),
  clearSignupStore: () => set({ signupData: null, tokenInfo: null }),
}));
