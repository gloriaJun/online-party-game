import { LobbyContent } from "@/components/lobby-content";

interface LobbyPageProps {
  readonly params: Promise<{ roomCode: string }>;
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const { roomCode } = await params;

  return <LobbyContent roomCode={roomCode} />;
}
