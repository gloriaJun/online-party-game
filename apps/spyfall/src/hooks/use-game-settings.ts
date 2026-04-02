"use client";

import { useEffect, useState, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface GameSettings {
  spyCount: number;
  timerMinutes: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  spyCount: 1,
  timerMinutes: 8,
};

const SETTINGS_EVENT = "game_settings_changed";

interface UseGameSettingsOptions {
  channel: RealtimeChannel | null;
  isHost: boolean;
  playerCount: number;
}

/**
 * Recommended spy count based on player count.
 * 4-6: max 1, 7-9: max 2 (rec 1), 10-12: max 2 (rec 2)
 */
export function getSpyCountOptions(playerCount: number): number[] {
  if (playerCount <= 6) return [1];
  return [1, 2];
}

/**
 * Recommended timer durations in minutes.
 */
export function getTimerOptions(): number[] {
  return [5, 6, 7, 8, 10];
}

export function useGameSettings({
  channel,
  isHost,
  playerCount,
}: UseGameSettingsOptions) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Listen for settings changes from host
  useEffect(() => {
    if (!channel || isHost) return;

    channel.on(
      "broadcast",
      { event: SETTINGS_EVENT },
      ({ payload }: { payload: GameSettings }) => {
        setSettings(payload);
      }
    );

    // Listener cleanup is handled by channel.unsubscribe() in usePresence
  }, [channel, isHost]);

  // Auto-adjust spy count if player count drops below threshold
  useEffect(() => {
    const maxSpy = playerCount <= 6 ? 1 : 2;
    if (settings.spyCount > maxSpy) {
      setSettings((prev) => ({ ...prev, spyCount: maxSpy }));
    }
  }, [playerCount, settings.spyCount]);

  const updateSettings = useCallback(
    (patch: Partial<GameSettings>) => {
      if (!isHost) return;

      const next = { ...settings, ...patch };
      setSettings(next);

      if (channel) {
        channel.send({
          type: "broadcast",
          event: SETTINGS_EVENT,
          payload: next,
        });
      }
    },
    [isHost, settings, channel]
  );

  return { settings, updateSettings };
}
