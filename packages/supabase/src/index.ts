export { supabase, getSupabaseClient } from "./client";
export { joinGameRoom, broadcastEvent, trackPresence } from "./realtime";
export type { Database, TypedSupabaseClient } from "./types/database";
export { getOrCreateAnonymousUser } from "./auth";
export {
  createRoom,
  joinRoom,
  getRoom,
  getRoomWithPlayers,
  RoomOperationError,
} from "./rooms";
export type { RoomError } from "./rooms";
export { getPlayers, removePlayer } from "./players";
