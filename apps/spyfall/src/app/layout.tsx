import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { GameLayout } from "@repo/ui/game-layout";
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

function HeaderRight({ locale }: Readonly<{ locale: string }>) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <LocaleSwitcher currentLocale={locale} />
    </div>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <GameLayout
              gameTitle="Spyfall"
              gameIcon="🕵️"
              backLabel={t("back")}
              headerRight={<HeaderRight locale={locale} />}
            >
              {children}
            </GameLayout>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
