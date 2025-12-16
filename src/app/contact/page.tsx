import { getSiteSettings } from "@/src/lib/queries/settings";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

import { redirect } from "next/navigation";

export default function ContactRedirect() {
  redirect("/tr/contact");
}
