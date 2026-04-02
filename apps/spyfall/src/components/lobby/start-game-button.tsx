"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";

const MIN_PLAYERS = 4;

interface StartGameButtonProps {
  readonly isHost: boolean;
  readonly playerCount: number;
  readonly onStartGame: () => void;
}

export function StartGameButton({
  isHost,
  playerCount,
  onStartGame,
}: StartGameButtonProps) {
  const t = useTranslations();
  const canStart = isHost && playerCount >= MIN_PLAYERS;

  if (!isHost) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="lg"
        className="w-full"
        disabled={!canStart}
        onClick={onStartGame}
      >
        {t("lobby.startGame")}
      </Button>
      {playerCount < MIN_PLAYERS && (
        <p className="text-muted-foreground text-xs">
          {t("lobby.minPlayers", { count: MIN_PLAYERS })}
        </p>
      )}
    </div>
  );
}
