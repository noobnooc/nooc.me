import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";

let locales = ["en", "zh"];
let defaultLocale = "en";

function getLocale(request: NextRequest) {
  let languages = new Negotiator({
    headers: Object.fromEntries(request.headers.entries()),
  })
    .languages()
    .filter((lang) => {
      try {
        // The type of `Intl.getCanonicalLocales` is not correct currently.
        // @ts-ignore
        Intl.getCanonicalLocales(lang);
        return true;
      } catch (e) {
        return false;
      }
    });

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/", "/works"],
};
