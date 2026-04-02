"use client";

import { useEffect, useState, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase";

export interface PresencePlayer {
  id: string;
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}

interface PresenceState {
  id: string;
  nickname: string;
  isHost: boolean;
}

interface UsePresenceOptions {
  roomCode: string;
  playerId: string;
  nickname: string;
  isHost: boolean;
  initialPlayers: PresencePlayer[];
}

export function usePresence({
  roomCode,
  playerId,
  nickname,
  isHost,
  initialPlayers,
}: UsePresenceOptions) {
  const [players, setPlayers] = useState<PresencePlayer[]>(initialPlayers);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  // Stabilize initialPlayers to avoid re-subscribing on every render
  const initialPlayersRef = useRef(initialPlayers);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const supabase = createBrowserClient();
    const channel = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: playerId } },
    });

    setChannel(channel);

    // Mutable list of known players, seeded from initial DB data
    let knownPlayers = [...initialPlayersRef.current];

    function syncPresence() {
      const presenceState = channel.presenceState<PresenceState>();
      const onlineIds = new Set<string>();

      for (const key of Object.keys(presenceState)) {
        for (const presence of presenceState[key] ?? []) {
          onlineIds.add(presence.id);
        }
      }

      // Merge: known players as base, presence determines isConnected
      const merged = knownPlayers.map((p) => ({
        ...p,
        isConnected: onlineIds.has(p.id),
      }));

      // Add any presence-only players not yet in known list (race condition guard)
      for (const key of Object.keys(presenceState)) {
        for (const presence of presenceState[key] ?? []) {
          if (!merged.some((p) => p.id === presence.id)) {
            merged.push({
              id: presence.id,
              nickname: presence.nickname,
              isHost: presence.isHost,
              isConnected: true,
            });
          }
        }
      }

      setPlayers(merged);
    }

    channel
      .on("presence", { event: "sync" }, () => {
        syncPresence();
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        // When a new player joins, add them to known list if missing
        for (const p of newPresences as unknown as PresenceState[]) {
          if (!knownPlayers.some((dp) => dp.id === p.id)) {
            knownPlayers = [
              ...knownPlayers,
              {
                id: p.id,
                nickname: p.nickname,
                isHost: p.isHost,
                isConnected: true,
              },
            ];
          }
        }
        syncPresence();
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: playerId,
            nickname,
            isHost,
          });
        }
      });

    return () => {
      channel.unsubscribe();
      setChannel(null);
    };
  }, [roomCode, playerId, nickname, isHost]);

  return { players, channel };
}
