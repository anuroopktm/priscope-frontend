import { useTranslation as useTranslationContext } from "@/shared/providers/TranslationProvider";

// Use the TranslationProvider context for client-side translations
export default function useTranslation() {
  return useTranslationContext();
}
