import { redirect } from "next/navigation";
import { i18n } from "@/src/lib/i18n/config";

export default function RootRedirect() {
  redirect(`/${i18n.defaultLocale}`);
}

