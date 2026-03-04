import { create } from "zustand";

interface OnboardingStore {
  data: {
    company_name: string;
    company_website: string | null;
    industry: string | null;
    company_size: string | null;
    primary_location: string | null;
    base_currency: string;
    company_logo: File | null;
    field_mappings: Record<string, string> | null;
    core_cost_element: string;
    additional_cost_elements: string | null;
    core_selling_price_element: string;
    additional_selling_price_elements: string | null;
    profitability_mode: string | null;
    system_identifier: string;
    fx_threshold: number | null;
    tariff_threshold: number | null;
    freight_threshold: number | null;
    min_margin: number | null;
    max_margin: number | null;
  };
  updateData: (payload: Partial<OnboardingStore["data"]>) => void;
  reset: () => void;
}

const initialState = {
  company_name: "",
  company_website: null,
  industry: null,
  company_size: null,
  primary_location: null,
  base_currency: "",
  company_logo: null,
  field_mappings: null,
  core_cost_element: "",
  additional_cost_elements: null,
  core_selling_price_element: "",
  additional_selling_price_elements: null,
  profitability_mode: "",
  system_identifier: "",
  fx_threshold: null,
  tariff_threshold: null,
  freight_threshold: null,
  min_margin: null,
  max_margin: null,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: initialState,

  updateData: (payload) =>
    set((state) => ({
      data: { ...state.data, ...payload },
    })),

  reset: () => set({ data: initialState }),
}));
