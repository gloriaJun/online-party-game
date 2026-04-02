"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@repo/ui/button";

interface ShareRoomProps {
  readonly roomCode: string;
}

export function ShareRoom({ roomCode }: ShareRoomProps) {
  const t = useTranslations();
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    const inviteUrl = `${globalThis.location.origin}/games/spyfall?roomCode=${roomCode}`;
    await navigator.clipboard.writeText(inviteUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        className="flex-1 gap-2 font-mono tracking-widest"
        onClick={handleCopyCode}
      >
        {codeCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {roomCode}
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={handleCopyLink}
      >
        {linkCopied ? (
          <>
            <Check className="h-4 w-4" />
            {t("lobby.linkCopied")}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {t("lobby.copyInviteLink")}
          </>
        )}
      </Button>
    </div>
  );
}
