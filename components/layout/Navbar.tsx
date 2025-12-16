import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { NavbarClient } from "@/components/layout/NavbarClient";

type NavbarProps = {
  locale: Locale;
};

export async function Navbar({ locale }: NavbarProps) {
  const dict = await getDictionary(locale);

  return <NavbarClient locale={locale} dict={dict} />;
}

