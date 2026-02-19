import { Lang, DEFAULT_LANG } from "@/shared/constants/i18n.constants";

type Dictionary = Record<string, Record<string, string>>;

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  for (const l of [lang, DEFAULT_LANG]) {
    try {
      return (await import(`@/shared/dictionaries/${l}.json`)).default;
    } catch {
      // continue to next language
    }
  }
  return {};
}

export async function createTranslator(lang?: Lang) {
  const dict = await getDictionary(lang ?? DEFAULT_LANG);
  const t = (section: string, key: string): string => {
    return dict?.[section]?.[key] || key;
  };
  return { t };
}
