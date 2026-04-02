"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { PlayerItem } from "./player-item";
import type { PresencePlayer } from "@/hooks/use-presence";

interface PlayerListProps {
  readonly players: PresencePlayer[];
  readonly maxPlayers: number;
  readonly currentPlayerId: string;
}

export function PlayerList({
  players,
  maxPlayers,
  currentPlayerId,
}: PlayerListProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {t("lobby.players")} ({players.length}/{maxPlayers})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {players.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {t("lobby.waitingForPlayers")}
          </p>
        ) : (
          <div>
            {players.map((player, index) => (
              <div key={player.id}>
                {index > 0 && <Separator />}
                <PlayerItem
                  player={player}
                  isCurrentUser={player.id === currentPlayerId}
                />
              </div>
            ))}
            {players.length < maxPlayers && (
              <>
                <Separator />
                <p className="text-muted-foreground px-3 py-2 text-center text-xs">
                  {t("lobby.waitingForPlayers")}
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
