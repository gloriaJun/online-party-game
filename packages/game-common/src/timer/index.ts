import type { TimerConfig } from "../types/index.js";

export function createTimer(durationSeconds: number): TimerConfig {
  return {
    durationSeconds,
    startedAt: null,
    isPaused: false,
  };
}

export function startTimer(timer: TimerConfig): TimerConfig {
  return {
    ...timer,
    startedAt: Date.now(),
    isPaused: false,
  };
}

export function getRemainingSeconds(timer: TimerConfig): number {
  if (!timer.startedAt || timer.isPaused) {
    return timer.durationSeconds;
  }

  const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
  return Math.max(0, timer.durationSeconds - elapsed);
}

export function isTimerExpired(timer: TimerConfig): boolean {
  return getRemainingSeconds(timer) <= 0;
}
