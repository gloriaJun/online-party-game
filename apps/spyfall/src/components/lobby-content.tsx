"use client";

import { useTranslations } from "next-intl";
import { usePresence, type PresencePlayer } from "@/hooks/use-presence";
import { useGameSettings } from "@/hooks/use-game-settings";
import { PlayerList } from "@/components/lobby/player-list";
import { GameSettings } from "@/components/lobby/game-settings";
import { ShareRoom } from "@/components/lobby/share-room";
import { StartGameButton } from "@/components/lobby/start-game-button";

interface LobbyContentProps {
  readonly roomCode: string;
  readonly nickname: string;
  readonly playerId: string;
  readonly isHost: boolean;
  readonly maxPlayers: number;
  readonly initialPlayers: PresencePlayer[];
}

export function LobbyContent({
  roomCode,
  nickname,
  playerId,
  isHost,
  maxPlayers,
  initialPlayers,
}: LobbyContentProps) {
  const t = useTranslations();

  const { players, channel } = usePresence({
    roomCode,
    playerId,
    nickname,
    isHost,
    initialPlayers,
  });

  const { settings, updateSettings } = useGameSettings({
    channel,
    isHost,
    playerCount: players.length,
  });

  const handleStartGame = () => {
    // Stub — will be implemented in issue #21 (game start & role reveal)
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-lg flex-col gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("lobby.title")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("lobby.joinedAs", { nickname })}
          </p>
        </div>

        <PlayerList
          players={players}
          maxPlayers={maxPlayers}
          currentPlayerId={playerId}
        />

        <GameSettings
          settings={settings}
          isHost={isHost}
          playerCount={players.length}
          onUpdate={updateSettings}
        />

        <ShareRoom roomCode={roomCode} />

        <StartGameButton
          isHost={isHost}
          playerCount={players.length}
          onStartGame={handleStartGame}
        />
      </div>
    </main>
  );
}
