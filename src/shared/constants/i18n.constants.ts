export const DEFAULT_LANG = "en";

export const SUPPORTED_LANG = ["en", "fr"] as const;

export type Lang = (typeof SUPPORTED_LANG)[number];
