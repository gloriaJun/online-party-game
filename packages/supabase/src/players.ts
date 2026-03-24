import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

type DbPlayer = Database["public"]["Tables"]["players"]["Row"];

export async function getPlayers(
  client: SupabaseClient<Database>,
  roomId: string
): Promise<DbPlayer[]> {
  const { data } = await client
    .from("players")
    .select()
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function removePlayer(
  client: SupabaseClient<Database>,
  playerId: string
): Promise<void> {
  await client.from("players").delete().eq("id", playerId);
}
