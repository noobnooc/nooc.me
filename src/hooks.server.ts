import { redirect, type Handle } from "@sveltejs/kit";
import { defaultLanguage, isLanguage, languages } from "$lib/dictionaries";

/** Paths that live outside the /{lang}/ namespace. */
const NON_LOCALIZED_PREFIXES = [
  "/api",
  "/feed",
  "/og",
  "/blog",
  "/static",
  "/images",
  "/_app",
];

function preferredLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLanguage;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      return { tag: tag.toLowerCase(), q: quality ? Number(quality.slice(2)) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const match = languages.find((lang) => tag === lang || tag.startsWith(`${lang}-`));
    if (match) return match;
  }

  return defaultLanguage;
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  // Redirect locale-less page paths (e.g. / or /posts) to the visitor's
  // preferred language. Assets, feeds, and generated files are excluded.
  const firstSegment = pathname.split("/")[1] ?? "";
  const isLocalized = isLanguage(firstSegment);
  const isExcluded =
    NON_LOCALIZED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) || /\.[a-zA-Z0-9]+$/.test(pathname);

  if (!isLocalized && !isExcluded) {
    const lang = preferredLanguage(event.request.headers.get("accept-language"));
    redirect(302, `/${lang}${pathname === "/" ? "" : pathname}`);
  }

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%lang%", isLocalized ? firstSegment : defaultLanguage),
  });
};
