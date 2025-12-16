import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const dict = await getDictionary(locale);

  return (
    <footer className="border-t border-white/5 bg-black/90">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-semibold text-zinc-200">
            Tatlı Bahçe Aile Restoranı
          </p>
          <p className="text-xs text-zinc-500">{dict.footer.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-xs">
            <p>Adres: Tatlı Bahçe Cd. No: 1</p>
            <p>Çalışma saatleri: 09:00 – 23:00</p>
          </div>
          <div className="flex flex-col text-xs">
            <a href="tel:+905416356485" className="hover:text-primary transition-colors">
              Tel: +90 541 635 64 85
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=905416356485"
              className="hover:text-primary transition-colors"
            >
              WhatsApp: +90 541 635 64 85
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


