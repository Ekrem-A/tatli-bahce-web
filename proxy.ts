import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If path already has a locale prefix, continue
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root path to default locale
  if (pathname === "/") {
    const locale = i18n.defaultLocale;
    const newUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only root path and paths without locale prefix
     */
    "/",
    "/((?!api|_next|favicon.ico|.*\\..*|tr|en).*)",
  ],
};
