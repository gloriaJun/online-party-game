"use server";

import {
  createRoom,
  joinRoom,
  getOrCreateAnonymousUser,
  RoomOperationError,
} from "@repo/supabase";
import type { RoomError } from "@repo/supabase";
import { createServerClient } from "@/lib/supabase";

type ActionResult =
  | { success: true; roomCode: string; playerId: string }
  | { success: false; error: RoomError | "UNKNOWN" };

export async function createRoomAction(
  nickname: string,
  gameType: string = "spyfall"
): Promise<ActionResult> {
  try {
    const client = createServerClient();
    let userId: string | null = null;
    try {
      userId = await getOrCreateAnonymousUser(client);
    } catch {
      // Continue without user_id — anonymous auth may not be enabled
    }

    const { room, player } = await createRoom(
      client,
      gameType,
      nickname,
      userId
    );
    return { success: true, roomCode: room.code, playerId: player.id };
  } catch (error) {
    if (error instanceof RoomOperationError) {
      return { success: false, error: error.code };
    }
    return { success: false, error: "UNKNOWN" };
  }
}

export async function joinRoomAction(
  roomCode: string,
  nickname: string
): Promise<ActionResult> {
  try {
    const client = createServerClient();
    let userId: string | null = null;
    try {
      userId = await getOrCreateAnonymousUser(client);
    } catch {
      // Continue without user_id
    }

    const { room, player } = await joinRoom(client, roomCode, nickname, userId);
    return { success: true, roomCode: room.code, playerId: player.id };
  } catch (error) {
    if (error instanceof RoomOperationError) {
      return { success: false, error: error.code };
    }
    return { success: false, error: "UNKNOWN" };
  }
}
