import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { resolveLocaleFromHeaders, LOCALE_COOKIE } from "@repo/game-common";

async function resolveLocale() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveLocaleFromHeaders(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerStore.get("accept-language") ?? ""
  );
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
