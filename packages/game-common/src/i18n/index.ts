export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Resolve locale from cookie value and Accept-Language header.
 * Priority: cookie → Accept-Language (iterates all ranges) → defaultLocale
 */
export function resolveLocaleFromHeaders(
  cookieLocale: string | undefined,
  acceptLanguage: string
): Locale {
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (acceptLanguage) {
    const languageRanges = acceptLanguage.split(",");
    for (const range of languageRanges) {
      const [languagePart] = range.split(";");
      const baseLocale = languagePart?.split("-")[0]?.trim();
      if (baseLocale && isValidLocale(baseLocale)) {
        return baseLocale;
      }
    }
  }

  return defaultLocale;
}
