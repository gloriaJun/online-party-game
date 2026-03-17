"use client";

import "flag-icons/css/flag-icons.min.css";

interface LocaleOption {
  value: string;
  label: string;
  countryCode: string;
}

interface LocaleSwitcherProps {
  currentLocale: string;
  locales?: LocaleOption[];
}

const defaultLocales: LocaleOption[] = [
  { value: "en", label: "EN", countryCode: "us" },
  { value: "ko", label: "KO", countryCode: "kr" },
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
    <div style={{ display: "flex", gap: "4px" }}>
      {locales.map((locale) => (
        <button
          key={locale.value}
          onClick={() => handleChange(locale.value)}
          disabled={currentLocale === locale.value}
          aria-label={`Switch to ${locale.label}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            border: "1px solid",
            borderColor:
              currentLocale === locale.value ? "#333" : "transparent",
            borderRadius: "4px",
            background: "none",
            cursor:
              currentLocale === locale.value ? "default" : "pointer",
            opacity: currentLocale === locale.value ? 1 : 0.6,
          }}
        >
          <span className={`fi fi-${locale.countryCode}`} />
          {locale.label}
        </button>
      ))}
    </div>
  );
};
