import { supabase } from "./client.js";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function joinGameRoom(roomCode: string): RealtimeChannel {
  return supabase.channel(`room:${roomCode}`, {
    config: { broadcast: { self: true } },
  });
}

export function broadcastEvent(
  channel: RealtimeChannel,
  event: string,
  payload: Record<string, unknown>
) {
  return channel.send({
    type: "broadcast",
    event,
    payload,
  });
}

export function trackPresence(
  channel: RealtimeChannel,
  playerData: { id: string; name: string }
) {
  return channel.track(playerData);
}
