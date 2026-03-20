import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@repo/ui/locale-switcher";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { ThemeToggle } from "@repo/ui/theme-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <header className="flex items-center justify-end gap-2 p-4">
              <ThemeToggle />
              <LocaleSwitcher currentLocale={locale} />
            </header>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
