import { getSiteSettings } from "@/lib/queries/settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

import { redirect } from "next/navigation";

export default function ContactRedirect() {
  redirect("/tr/contact");
}
