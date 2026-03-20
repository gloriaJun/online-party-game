"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "./lib/utils";

interface GameLayoutProps {
  children: React.ReactNode;
  gameTitle: string;
  gameIcon?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  sidebar?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function GameLayout({
  children,
  gameTitle,
  gameIcon,
  backHref = "/",
  backLabel = "Back",
  sidebar,
  className,
  headerRight,
}: GameLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>

          <div className="flex items-center gap-2">
            {gameIcon && (
              <span className="text-lg leading-none">{gameIcon}</span>
            )}
            <h1 className="text-lg font-semibold tracking-tight">
              {gameTitle}
            </h1>
          </div>

          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </div>
      </header>

      <div className="flex flex-1">
        {sidebar && <aside className="border-r border-border">{sidebar}</aside>}
        <main className={cn("flex-1 p-4 md:p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
