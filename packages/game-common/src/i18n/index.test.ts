import { describe, it, expect } from "vitest";
import {
  locales,
  defaultLocale,
  isValidLocale,
  LOCALE_COOKIE,
  resolveLocaleFromHeaders,
} from "./index";

describe("i18n constants", () => {
  it("has en and ko locales", () => {
    expect(locales).toEqual(["en", "ko"]);
  });

  it("defaults to en", () => {
    expect(defaultLocale).toBe("en");
  });

  it("LOCALE_COOKIE is NEXT_LOCALE", () => {
    expect(LOCALE_COOKIE).toBe("NEXT_LOCALE");
  });
});

describe("isValidLocale", () => {
  it("returns true for valid locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("ko")).toBe(true);
  });

  it("returns false for invalid locales", () => {
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("EN")).toBe(false);
  });
});

describe("resolveLocaleFromHeaders", () => {
  it("returns cookie locale when valid", () => {
    expect(resolveLocaleFromHeaders("ko", "en-US,en;q=0.9")).toBe("ko");
  });

  it("ignores invalid cookie locale", () => {
    expect(resolveLocaleFromHeaders("fr", "ko-KR,ko;q=0.9")).toBe("ko");
  });

  it("ignores undefined cookie locale", () => {
    expect(resolveLocaleFromHeaders(undefined, "ko-KR,ko;q=0.9")).toBe("ko");
  });

  it("parses Accept-Language with quality values", () => {
    expect(resolveLocaleFromHeaders(undefined, "ko-KR,ko;q=0.9,en;q=0.8")).toBe("ko");
  });

  it("falls through unsupported languages to find a match", () => {
    expect(resolveLocaleFromHeaders(undefined, "fr-FR,ja;q=0.9,ko;q=0.8")).toBe("ko");
  });

  it("extracts base locale from region subtag", () => {
    expect(resolveLocaleFromHeaders(undefined, "en-US")).toBe("en");
    expect(resolveLocaleFromHeaders(undefined, "ko-KR")).toBe("ko");
  });

  it("returns default locale when no match found", () => {
    expect(resolveLocaleFromHeaders(undefined, "fr-FR,ja;q=0.9")).toBe("en");
  });

  it("returns default locale for empty Accept-Language", () => {
    expect(resolveLocaleFromHeaders(undefined, "")).toBe("en");
  });

  it("cookie takes priority over Accept-Language", () => {
    expect(resolveLocaleFromHeaders("en", "ko-KR,ko;q=0.9")).toBe("en");
  });
});
