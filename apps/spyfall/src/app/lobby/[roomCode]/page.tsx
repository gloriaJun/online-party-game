import { useTranslations } from "next-intl";
import { Card } from "@repo/ui/card";

interface LobbyPageProps {
  params: Promise<{ roomCode: string }>;
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const { roomCode } = await params;

  return <LobbyContent roomCode={roomCode} />;
}

function LobbyContent({ roomCode }: { roomCode: string }) {
  const t = useTranslations("lobby");

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
      </Card>
    </main>
  );
}
