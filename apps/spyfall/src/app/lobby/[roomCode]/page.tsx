import { redirect } from "next/navigation";
import { getRoomWithPlayers } from "@repo/supabase";
import { createServerClient } from "@/lib/supabase";
import { LobbyContent } from "@/components/lobby-content";

export const dynamic = "force-dynamic";

interface LobbyPageProps {
  readonly params: Promise<{ roomCode: string }>;
  readonly searchParams: Promise<{ nickname?: string; playerId?: string }>;
}

export default async function LobbyPage({
  params,
  searchParams,
}: LobbyPageProps) {
  const { roomCode } = await params;
  const { nickname, playerId } = await searchParams;

  if (!nickname || !playerId) {
    redirect(`/?roomCode=${roomCode}`);
  }

  const client = createServerClient();
  const result = await getRoomWithPlayers(client, roomCode);

  if (!result) {
    redirect("/");
  }

  const { room, players } = result;

  const initialPlayers = players.map((p) => ({
    id: p.id,
    nickname: p.nickname,
    isHost: p.is_host,
    isConnected: false,
  }));

  const isHost = room.host_player_id === playerId;

  return (
    <LobbyContent
      roomCode={room.code}
      nickname={nickname}
      playerId={playerId}
      isHost={isHost}
      maxPlayers={room.max_players}
      initialPlayers={initialPlayers}
    />
  );
}
