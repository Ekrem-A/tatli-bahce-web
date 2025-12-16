import { getSiteSettings } from "@/lib/queries/settings";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";

type AboutPageProps = {
  params: any;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params;
  const langParam = resolvedParams?.lang ?? i18n.defaultLocale;
  const locale: Locale = isLocale(langParam) ? langParam : i18n.defaultLocale;

  const settings = await getSiteSettings();
  const aboutTitle = settings.about_title ??
    (locale === "tr" ? "Tatlı Bahçe Hakkında" : "About Tatlı Bahçe");
  const aboutIntro =
    settings.about_intro ??
    (locale === "tr"
      ? "Tatlı Bahçe, ailelerin birlikte keyifli vakit geçirebileceği sıcak ve samimi bir mahalle restoranıdır."
      : "Tatlı Bahçe is a warm and cozy neighborhood restaurant where families can enjoy time together.");
  const aboutStory =
    settings.about_story ??
    (locale === "tr"
      ? "Tatlı Bahçe'de amacımız, misafirlerimize evlerindeki kadar rahat hissedebilecekleri bir ortam sunmak. Menümüzdeki pek çok lezzet, yıllardır aile sofralarımızda pişen tariflerden esinleniyor."
      : "Our goal at Tatlı Bahçe is to create a place where guests feel as comfortable as at home. Many of our recipes are inspired by dishes from our own family table.");
  const aboutKitchen =
    settings.about_kitchen ??
    (locale === "tr"
      ? "Mutfakta mevsim sebzelerini, yerel üreticilerden temin edilen ürünleri ve günlük taze malzemeleri kullanmaya özen gösteriyoruz. Menüde herkes için bir seçenek olsun istiyoruz."
      : "We use seasonal vegetables, locally sourced products and fresh ingredients every day. We want our menu to offer something for everyone.");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
          {aboutTitle}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
          {aboutIntro}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-3xl border border-white/5 bg-black/40 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-zinc-50">
            {locale === "tr"
              ? "Aile sofralarından ilham aldık"
              : "Inspired by family tables"}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            {aboutStory}
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-white/5 bg-black/40 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-zinc-50">
            {locale === "tr" ? "Malzemeler ve mutfak" : "Ingredients & kitchen"}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            {aboutKitchen}
          </p>
        </section>
      </div>
    </div>
  );
}


