import { getMenuTree } from "@/lib/queries/menu";
import type { MenuTreeItem } from "@/lib/queries/menu";
import { getSiteSettings } from "@/lib/queries/settings";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";
import { MenuClient } from "@/components/menu/MenuClient";

type MenuPageProps = {
  params: any;
};

export default async function MenuPage({ params }: MenuPageProps) {
  const resolvedParams = await params;
  const langParam = resolvedParams?.lang ?? i18n.defaultLocale;
  const locale: Locale = isLocale(langParam) ? langParam : i18n.defaultLocale;

  const languageCode = locale;
  const [tree, settings]: [MenuTreeItem[], Record<string, string | null>] =
    await Promise.all([getMenuTree(languageCode), getSiteSettings()]);

  const whatsappPhone = settings.whatsapp_phone ?? "+90 541 635 64 85";

  return <MenuClient tree={tree} locale={locale} whatsappPhone={whatsappPhone} />;
}

