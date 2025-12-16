import type { Locale } from "@/src/lib/i18n/config";
import { getDictionary } from "@/src/lib/i18n/dictionaries";
import { NavbarClient } from "@/src/components/layout/NavbarClient";

type NavbarProps = {
  locale: Locale;
};

export async function Navbar({ locale }: NavbarProps) {
  const dict = await getDictionary(locale);

  return <NavbarClient locale={locale} dict={dict} />;
}

