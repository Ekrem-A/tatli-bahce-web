import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getSiteSettings } from "@/lib/queries/settings";
import { getServerClient } from "@/lib/supabaseClient";
import type { ProductWithTranslations } from "@/lib/types";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type HomePageProps = {
  params: any;
};

export default async function Home({ params }: HomePageProps) {
  const resolvedParams = await params;
  const langParam = resolvedParams?.lang ?? i18n.defaultLocale;
  const locale: Locale = isLocale(langParam) ? langParam : i18n.defaultLocale;

  const [settings, dict] = await Promise.all([
    getSiteSettings(),
    getDictionary(locale),
  ]);

  const supabase = getServerClient();
  const { data: featured } = await supabase
    .from("products_with_translations")
    .select("*")
    .eq("language_code", locale)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const heroTitle =
    settings.hero_title ??
    (locale === "tr"
      ? "Ailenizle sıcak sofralara Tatlı Bahçe'ye bekleriz."
      : "We welcome you and your family to the warm tables of Tatlı Bahçe.");

  const heroSubtitle =
    settings.hero_subtitle ??
    (locale === "tr"
      ? "Ev yapımı lezzetler, dumanı üzerinde ızgaralar ve gün boyu kahvaltı seçenekleriyle Tatlı Bahçe; ailece keyifli vakit geçirebileceğiniz samimi bir restoran."
      : "With homemade flavors, grilled dishes and all-day breakfast, Tatlı Bahçe is a cozy place where families can enjoy time together.");

  const whatsappPhone = settings.whatsapp_phone ?? "+90 541 635 64 85";

  const featuredProducts = (featured ?? []) as ProductWithTranslations[];

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-br from-card to-black/60 px-6 py-10 shadow-2xl shadow-black/40 md:grid-cols-[1.3fr,1fr] md:px-10 md:py-12">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {dict.hero.badge}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {heroTitle}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`/${locale}/menu`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-zinc-900/40 transition hover:bg-zinc-200"
            >
              {locale === "tr" ? "Menüyü incele" : "View the menu"}
            </a>
            <WhatsAppButton
              id="whatsapp"
              label={
                locale === "tr"
                  ? "WhatsApp ile sipariş ver"
                  : "Order via WhatsApp"
              }
              phoneNumber={whatsappPhone}
              message={
                locale === "tr"
                  ? "Merhaba, Tatlı Bahçe'den sipariş vermek istiyorum."
                  : "Hello, I would like to order from Tatlı Bahçe."
              }
            />
          </div>
          <dl className="mt-4 grid gap-4 text-xs text-zinc-400 sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-zinc-200">
                {locale === "tr" ? "Çalışma saatleri" : "Opening hours"}
              </dt>
              <dd>{settings.opening_hours ?? "09:00 – 23:00"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-200">
                {locale === "tr" ? "Konum" : "Location"}
              </dt>
              <dd>{settings.address ?? "Tatlı Bahçe Cd. No: 1"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-200">
                {locale === "tr" ? "Aile ortamı" : "Family friendly"}
              </dt>
              <dd>
                {locale === "tr"
                  ? "Çocuk dostu, geniş masa düzeni"
                  : "Child-friendly, spacious tables"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/5 bg-black/40 p-5 text-sm text-zinc-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {locale === "tr" ? "Bugün ne yesek?" : "What shall we eat today?"}
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              {locale === "tr" ? "Günün önerileri" : "Today’s picks"}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {featuredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-zinc-400">
                      {product.short_description ?? product.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {`${(product.discount_price ?? product.price).toLocaleString("tr-TR")} TL`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-2xl bg-zinc-900/60 px-4 py-3 text-xs text-zinc-400">
            {locale === "tr"
              ? "Fiyatlar örnek olarak gösterilmektedir. En güncel fiyatlarımız için menü sayfasına göz atabilir veya WhatsApp üzerinden bize ulaşabilirsiniz."
              : "Prices are for illustration. For the latest prices, please check the menu page or contact us via WhatsApp."}
          </p>
        </div>
      </section>
    </div>
  );
}


