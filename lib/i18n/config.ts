export const i18n = {
  locales: ["tr", "en"] as const,
  defaultLocale: "tr" as const,
};

export type Locale = (typeof i18n.locales)[number];

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}


