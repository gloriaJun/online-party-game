"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Link } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";

export function LobbyContent({ roomCode }: { roomCode: string }) {
  const t = useTranslations("lobby");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const inviteUrl = `${globalThis.location.origin}/games/spyfall?roomCode=${roomCode}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 text-center md:p-8">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2 font-mono text-lg tracking-widest">
          {roomCode}
        </p>
        <p className="text-muted-foreground mt-4 text-sm">
          {t("waitingForPlayers")}
        </p>
        <Button
          variant="outline"
          className="mt-4 gap-2"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {t("linkCopied")}
            </>
          ) : (
            <>
              <Link className="h-4 w-4" />
              {t("copyInviteLink")}
            </>
          )}
        </Button>
      </Card>
    </main>
  );
}
