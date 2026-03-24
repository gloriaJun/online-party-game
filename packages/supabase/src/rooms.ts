import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

type DbRoom = Database["public"]["Tables"]["rooms"]["Row"];
type DbPlayer = Database["public"]["Tables"]["players"]["Row"];

export type RoomError =
  | "ROOM_NOT_FOUND"
  | "ROOM_FULL"
  | "ROOM_NOT_WAITING"
  | "NICKNAME_TAKEN"
  | "CREATE_FAILED";

export class RoomOperationError extends Error {
  constructor(public readonly code: RoomError) {
    super(code);
    this.name = "RoomOperationError";
  }
}

const MAX_CODE_ATTEMPTS = 5;
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;

function generateCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

export async function createRoom(
  client: SupabaseClient<Database>,
  gameType: string,
  nickname: string,
  userId: string | null
): Promise<{ room: DbRoom; player: DbPlayer }> {
  let room: DbRoom | null = null;

  for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
    const code = generateCode();
    const { data, error } = await client
      .from("rooms")
      .insert({ code, game_type: gameType })
      .select()
      .single();

    if (!error && data) {
      room = data;
      break;
    }
    if (error?.code === "23505") continue;
    throw new RoomOperationError("CREATE_FAILED");
  }

  if (!room) throw new RoomOperationError("CREATE_FAILED");

  const { data: player, error: playerError } = await client
    .from("players")
    .insert({
      room_id: room.id,
      nickname: nickname.trim(),
      is_host: true,
      user_id: userId,
    })
    .select()
    .single();

  if (playerError || !player) {
    await client.from("rooms").delete().eq("id", room.id);
    throw new RoomOperationError("CREATE_FAILED");
  }

  await client
    .from("rooms")
    .update({ host_player_id: player.id })
    .eq("id", room.id);

  room.host_player_id = player.id;

  return { room, player };
}

export async function joinRoom(
  client: SupabaseClient<Database>,
  roomCode: string,
  nickname: string,
  userId: string | null
): Promise<{ room: DbRoom; player: DbPlayer }> {
  const { data: room, error: roomError } = await client
    .from("rooms")
    .select()
    .eq("code", roomCode.toUpperCase())
    .single();

  if (roomError || !room) throw new RoomOperationError("ROOM_NOT_FOUND");

  if (room.status !== "waiting") throw new RoomOperationError("ROOM_NOT_WAITING");

  const { count } = await client
    .from("players")
    .select("*", { count: "exact", head: true })
    .eq("room_id", room.id);

  if (count !== null && count >= room.max_players) {
    throw new RoomOperationError("ROOM_FULL");
  }

  const { data: existing } = await client
    .from("players")
    .select("id")
    .eq("room_id", room.id)
    .ilike("nickname", nickname.trim());

  if (existing && existing.length > 0) {
    throw new RoomOperationError("NICKNAME_TAKEN");
  }

  const { data: player, error: playerError } = await client
    .from("players")
    .insert({
      room_id: room.id,
      nickname: nickname.trim(),
      is_host: false,
      user_id: userId,
    })
    .select()
    .single();

  if (playerError || !player) throw new RoomOperationError("CREATE_FAILED");

  return { room, player };
}

export async function getRoom(
  client: SupabaseClient<Database>,
  roomCode: string
): Promise<DbRoom | null> {
  const { data } = await client
    .from("rooms")
    .select()
    .eq("code", roomCode.toUpperCase())
    .single();

  return data;
}

export async function getRoomWithPlayers(
  client: SupabaseClient<Database>,
  roomCode: string
): Promise<{ room: DbRoom; players: DbPlayer[] } | null> {
  const { data: room } = await client
    .from("rooms")
    .select()
    .eq("code", roomCode.toUpperCase())
    .single();

  if (!room) return null;

  const { data: players } = await client
    .from("players")
    .select()
    .eq("room_id", room.id)
    .order("created_at", { ascending: true });

  return { room, players: players ?? [] };
}
