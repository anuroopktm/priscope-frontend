"use client";

import React, { createContext, useContext } from "react";
import { Lang, DEFAULT_LANG } from "@/shared/constants/i18n.constants";
import { get } from "lodash";

type Dictionary = Record<string, Record<string, string>>;

interface TranslationContextProps {
  lang: Lang;
  t: (section: string, key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps>({
  lang: DEFAULT_LANG,
  t: (_section, key) => key,
});

export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  lang: Lang;
  dictionary: Dictionary;
  children: React.ReactNode;
}

export const TranslationProvider = ({
  lang,
  dictionary,
  children,
}: TranslationProviderProps) => {
  const t = (section: string, key: string): string => {
    const value = get(dictionary, `${section}.${key}`);
    return typeof value === "string" ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ lang, t }}>
      {children}
    </TranslationContext.Provider>
  );
};
