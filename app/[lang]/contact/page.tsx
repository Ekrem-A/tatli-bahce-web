import { getSiteSettings } from "@/lib/queries/settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";

type ContactPageProps = {
  params: any;
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ContactPage({ params }: ContactPageProps) {
  const resolvedParams = await params;
  const langParam = resolvedParams?.lang ?? i18n.defaultLocale;
  const locale: Locale = isLocale(langParam) ? langParam : i18n.defaultLocale;

  const settings = await getSiteSettings();
  const phone = settings.phone ?? "05416356485";
  const whatsappPhone = settings.whatsapp_phone ?? phone;
  const address =
    settings.address ?? "Tatlı Bahçe Cd. No: 1\nMerkez / Şehir";
  const opening =
    settings.opening_hours ??
    (locale === "tr"
      ? "Her gün 09:00 – 23:00\n(Resmi tatil günleri hariç)"
      : "Every day 09:00 – 23:00\n(except public holidays)");
  const mapEmbedUrl = settings.map_embed_url ?? "";

  const whatsappHref = buildWhatsAppLink(
    whatsappPhone,
    locale === "tr"
      ? "Merhaba, Tatlı Bahçe'den rezervasyon / bilgi almak istiyorum."
      : "Hello, I would like to get information / make a reservation at Tatlı Bahçe.",
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
          {locale === "tr" ? "İletişim & Adres" : "Contact & Address"}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
          {locale === "tr"
            ? "Rezervasyon, toplu yemek organizasyonları veya paket siparişler için aşağıdaki bilgilerden bize ulaşabilirsiniz."
            : "For reservations, group meals or takeaway orders, you can reach us using the details below."}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.1fr,1.1fr]">
        <section className="space-y-4 rounded-3xl border border-white/5 bg-black/40 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-zinc-50">
            {locale === "tr" ? "İletişim" : "Contact"}
          </h2>
          <dl className="space-y-3 text-sm text-zinc-200">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {locale === "tr" ? "Telefon" : "Phone"}
              </dt>
              <dd>
                <a
                  href={`tel:${phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                WhatsApp
              </dt>
              <dd>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {whatsappPhone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {locale === "tr" ? "Adres" : "Address"}
              </dt>
              <dd className="whitespace-pre-line text-zinc-300">{address}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {locale === "tr" ? "Çalışma saatleri" : "Opening hours"}
              </dt>
              <dd className="whitespace-pre-line text-zinc-300">
                {opening}
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4 rounded-3xl border border-white/5 bg-black/40 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-zinc-50">
            {locale === "tr" ? "Harita" : "Map"}
          </h2>
          <p className="text-sm text-zinc-300">
            {locale === "tr"
              ? "Aşağıdaki haritadan Tatlı Bahçe'nin konumunu görebilir, yol tarifi alabilirsiniz."
              : "You can view the location of Tatlı Bahçe on the map below and get directions."}
          </p>
          <div className="relative mt-2 h-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="Tatlı Bahçe Konumu"
                loading="lazy"
                className="h-full w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.3785473532757!2d29.070476675514417!3d41.01697341889025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac86db24105e1%3A0xf328918e7271cd4e!2zVGF0bMSxIEJhaMOnZQ!5e0!3m2!1str!2str!4v1765907011401!5m2!1str!2str"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={locale === "tr" ? "Tatlı Bahçe Konumu" : "Tatli Bahce Location"}
                  className="h-full w-full border-0"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}


