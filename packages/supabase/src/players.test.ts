import { describe, it, expect } from "vitest";
import { getPlayers, removePlayer } from "./players";
import type { TypedSupabaseClient } from "./types/database";

function makePlayer(overrides: Record<string, unknown> = {}) {
  return {
    id: "player-1",
    room_id: "room-1",
    nickname: "Alice",
    is_host: true,
    user_id: null,
    role: null,
    is_spy: false,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("getPlayers", () => {
  it("returns players for a room", async () => {
    const players = [
      makePlayer(),
      makePlayer({ id: "player-2", nickname: "Bob", is_host: false }),
    ];

    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: players, error: null }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    const result = await getPlayers(client, "room-1");
    expect(result).toHaveLength(2);
    expect(result[0]?.nickname).toBe("Alice");
    expect(result[1]?.nickname).toBe("Bob");
  });

  it("returns empty array when no players exist", async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    const result = await getPlayers(client, "room-1");
    expect(result).toEqual([]);
  });
});

describe("removePlayer", () => {
  it("calls delete with correct player id", async () => {
    let deletedId: unknown = null;

    const client = {
      from: () => ({
        delete: () => ({
          eq: (_col: string, val: unknown) => {
            deletedId = val;
            return Promise.resolve({ data: null, error: null });
          },
        }),
      }),
    } as unknown as TypedSupabaseClient;

    await removePlayer(client, "player-to-remove");
    expect(deletedId).toBe("player-to-remove");
  });
});
