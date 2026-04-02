"use client";

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/lib/utils";
import type { PresencePlayer } from "@/hooks/use-presence";

interface PlayerItemProps {
  readonly player: PresencePlayer;
  readonly isCurrentUser: boolean;
}

export function PlayerItem({ player, isCurrentUser }: PlayerItemProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3",
        isCurrentUser && "bg-accent/50 rounded-md"
      )}
    >
      <div className="flex items-center gap-2">
        {player.isHost && (
          <span className="text-sm" title={t("lobby.host")} aria-label={t("lobby.host")}>
            👑
          </span>
        )}
        <span className={cn("text-sm", isCurrentUser && "font-semibold")}>
          {player.nickname}
        </span>
      </div>
      <span
        className={cn(
          "inline-block h-2.5 w-2.5 rounded-full",
          player.isConnected ? "bg-green-500" : "bg-muted"
        )}
        aria-label={player.isConnected ? t("lobby.connected") : t("lobby.disconnected")}
      />
    </div>
  );
}
