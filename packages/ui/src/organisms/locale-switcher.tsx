"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentOption = locales.find((l) => l.value === currentLocale);

  function handleChange(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        {currentOption && (
          <span className={`fi fi-${currentOption.countryCode}`} />
        )}
      </button>

      {open && (
        <div className="border-border bg-popover absolute top-full right-0 z-50 mt-1 min-w-[120px] overflow-hidden rounded-md border p-1 shadow-md">
          {locales.map((locale) => (
            <button
              key={locale.value}
              onClick={() => {
                if (locale.value !== currentLocale) {
                  handleChange(locale.value);
                }
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
                locale.value === currentLocale
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className={`fi fi-${locale.countryCode}`} />
              {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
