import Link from "next/link";

const games = [
  {
    id: "spyfall",
    name: "Spyfall",
    description: "Find the spy among your friends!",
    minPlayers: 4,
    maxPlayers: 12,
    path: "/games/spyfall",
  },
];

export default function Home() {
  return (
    <main>
      <h1>Online Party Games</h1>
      <p>Choose a game to play with friends</p>
      <div>
        {games.map((game) => (
          <Link key={game.id} href={game.path}>
            <div>
              <h2>{game.name}</h2>
              <p>{game.description}</p>
              <span>
                {game.minPlayers}-{game.maxPlayers} players
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
