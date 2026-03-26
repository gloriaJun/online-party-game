import { redirect } from "next/navigation";
import { getRoom } from "@repo/supabase";
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

  const client = createServerClient();
  const room = await getRoom(client, roomCode);

  if (!room) {
    redirect("/");
  }

  return (
    <LobbyContent
      roomCode={room.code}
      nickname={nickname ?? ""}
      playerId={playerId ?? ""}
    />
  );
}
