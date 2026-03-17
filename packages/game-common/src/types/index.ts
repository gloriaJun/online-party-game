export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  isHost: boolean;
  isConnected: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  status: RoomStatus;
  gameType: string;
  createdAt: number;
}

export type RoomStatus = "waiting" | "playing" | "finished";

export interface VoteResult {
  targetId: string | null;
  isTied: boolean;
  voteCounts: Record<string, number>;
  tiedCandidates: string[];
}

export type TieBreakRule = "revote-tied" | "revote-all" | "spy-wins";

export interface TimerConfig {
  durationSeconds: number;
  startedAt: number | null;
  isPaused: boolean;
}
