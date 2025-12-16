import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";

type LangLayoutProps = {
  children: ReactNode;
  // Next.js, typed routes ile params'i Promise olarak geçirebiliyor; bu yüzden geniş bir tip kullanıyoruz.
  params: any;
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const resolvedParams = await params;
  const localeParam = resolvedParams?.lang ?? i18n.defaultLocale;
  const locale: Locale = isLocale(localeParam)
    ? localeParam
    : i18n.defaultLocale;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50">
      <Navbar locale={locale} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-10">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}


