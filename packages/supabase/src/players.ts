import type { Database, TypedSupabaseClient } from "./types/database";

type DbPlayer = Database["public"]["Tables"]["players"]["Row"];

export async function getPlayers(
  client: TypedSupabaseClient,
  roomId: string
): Promise<DbPlayer[]> {
  const { data } = await client
    .from("players")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function removePlayer(
  client: TypedSupabaseClient,
  playerId: string
): Promise<void> {
  await client.from("players").delete().eq("id", playerId);
}
