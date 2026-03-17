import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  isValidLocale,
  LOCALE_COOKIE,
} from "@repo/game-common";

async function resolveLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  if (acceptLanguage) {
    const languageRanges = acceptLanguage.split(",");
    for (const range of languageRanges) {
      const [languagePart] = range.split(";");
      const baseLocale = languagePart.split("-")[0]?.trim();
      if (baseLocale && isValidLocale(baseLocale)) {
        return baseLocale;
      }
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
