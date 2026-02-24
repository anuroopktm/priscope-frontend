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
  signupData: {
    email: "[EMAIL_ADDRESS]",
    password: "[PASSWORD]",
    confirmPassword: "[PASSWORD]",
  },
  tokenInfo: {
    email: "[EMAIL_ADDRESS]",
    tenant_id: "[ENCRYPTION_KEY]",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidGVuYW50X2lkIjoiW0VOQ1JZXFRJT05fSUQ KIiLCJleHAiOjE3NTQyMzM3NDJ9.6gJ_2X_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q",
  },
  setSignupData: (data) => set({ signupData: data }),
  setTokenInfo: (info) => set({ tokenInfo: info }),
  clearSignupStore: () => set({ signupData: null, tokenInfo: null }),
}));
