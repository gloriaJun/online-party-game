"use client";

import Link from "next/link";
import { ChevronLeft, House } from "lucide-react";
import { cn } from "./lib/utils";

interface GameLayoutProps {
  children: React.ReactNode;
  gameTitle: string;
  gameIcon?: React.ReactNode;
  backHref?: string;
  homeHref?: string;
  sidebar?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function GameLayout({
  children,
  gameTitle,
  gameIcon,
  backHref,
  homeHref,
  sidebar,
  className,
  headerRight,
}: GameLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          {/* Mobile: Back button (visible only on mobile) */}
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}

          {/* Home button */}
          {homeHref && (
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Home"
            >
              <House className="h-5 w-5" />
            </Link>
          )}

          {/* Game title */}
          <div className="flex items-center gap-2">
            {gameIcon && (
              <span className="text-lg leading-none">{gameIcon}</span>
            )}
            <h1 className="text-lg font-semibold tracking-tight">
              {gameTitle}
            </h1>
          </div>

          {/* Right slot */}
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </div>
      </header>

      <div className="flex flex-1">
        {sidebar && (
          <aside className="border-r border-border">{sidebar}</aside>
        )}
        <main className={cn("flex-1 p-4 md:p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
