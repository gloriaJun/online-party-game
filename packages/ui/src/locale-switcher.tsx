"use client";

interface LocaleSwitcherProps {
  currentLocale: string;
  locales?: { value: string; label: string }[];
}

const defaultLocales = [
  { value: "en", label: "\u{1F1FA}\u{1F1F8} EN" },
  { value: "ko", label: "\u{1F1F0}\u{1F1F7} KO" },
];

export const LocaleSwitcher = ({
  currentLocale,
  locales = defaultLocales,
}: LocaleSwitcherProps) => {
  function handleChange(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale.value} value={locale.value}>
          {locale.label}
        </option>
      ))}
    </select>
  );
};
