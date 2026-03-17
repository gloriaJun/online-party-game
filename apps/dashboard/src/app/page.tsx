import Link from "next/link";
import { useTranslations } from "next-intl";

const games = [
  {
    id: "spyfall",
    minPlayers: 4,
    maxPlayers: 12,
    path: "/games/spyfall",
  },
];

export default function Home() {
  const t = useTranslations();

  return (
    <main>
      <h1>{t("home.title")}</h1>
      <p>{t("home.subtitle")}</p>
      <div>
        {games.map((game) => (
          <Link key={game.id} href={game.path}>
            <div>
              <h2>{t(`games.${game.id}.name`)}</h2>
              <p>{t(`games.${game.id}.description`)}</p>
              <span>
                {t("home.players", {
                  min: game.minPlayers,
                  max: game.maxPlayers,
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
