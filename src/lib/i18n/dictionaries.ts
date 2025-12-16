import type { Locale } from "@/lib/i18n/config";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

const dictionaries = {
  tr,
  en,
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}


