"use client";

import type { Dictionary } from "@/src/lib/i18n/dictionaries";
import type { Locale } from "@/src/lib/i18n/config";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type NavbarClientProps = {
  locale: Locale;
  dict: Dictionary;
};

function buildLocaleLink(pathname: string, targetLocale: Locale) {
  if (!pathname || pathname === "/") {
    return `/${targetLocale}`;
  }

  const segments = pathname.split("/");
  // ["", "tr", "menu", ...] gibi
  if (segments.length > 1) {
    segments[1] = targetLocale;
  }

  const nextPath = segments.join("/") || "/";
  return nextPath;
}

export function NavbarClient({ locale, dict }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const href = buildLocaleLink(pathname, nextLocale);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <Image
              src="/logo.png"
              alt="Tatlı Bahçe Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-zinc-900">
              Tatlı Bahçe
            </p>
            <p className="text-xs text-zinc-500">Aile restoranı</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
          <a
            href={`/${locale}`}
            className="hover:text-primary transition-colors"
          >
            {dict.navbar.home}
          </a>
          <a
            href={`/${locale}/menu`}
            className="hover:text-primary transition-colors"
          >
            {dict.navbar.menu}
          </a>
          <a
            href={`/${locale}/about`}
            className="hover:text-primary transition-colors"
          >
            {dict.navbar.about}
          </a>
          <a
            href={`/${locale}/contact`}
            className="hover:text-primary transition-colors"
          >
            {dict.navbar.contact}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-1 py-0.5 text-[11px] font-semibold text-zinc-600 shadow-sm">
            <button
              type="button"
              onClick={() => handleLocaleChange("tr")}
              className={`rounded-full px-2 py-0.5 transition ${
                locale === "tr"
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }`}
            >
              TR
            </button>
            <span className="text-zinc-300">|</span>
            <button
              type="button"
              onClick={() => handleLocaleChange("en")}
              className={`rounded-full px-2 py-0.5 transition ${
                locale === "en"
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }`}
            >
              EN
            </button>
          </div>
          <a
            href="#whatsapp"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-primary/40 transition hover:bg-primary-soft"
          >
            <span>{dict.navbar.whatsapp}</span>
          </a>
        </div>
      </div>
    </header>
  );
}


