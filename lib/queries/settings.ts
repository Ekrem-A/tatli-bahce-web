import { getServerClient } from "@/lib/supabaseClient";
import type { SiteSetting } from "@/lib/types";

export type SiteSettingsMap = {
  [key: string]: string | null;
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("key,value");

  if (error) {
    throw new Error(error.message);
  }

  const settings = (data ?? []) as SiteSetting[];
  const map: SiteSettingsMap = {};

  for (const setting of settings) {
    map[setting.key] = setting.value;
  }

  return map;
}


