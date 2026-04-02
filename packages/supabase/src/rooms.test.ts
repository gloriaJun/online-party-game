import { describe, it, expect } from "vitest";
import {
  createRoom,
  joinRoom,
  getRoom,
  getRoomWithPlayers,
  RoomOperationError,
} from "./rooms";
import type { TypedSupabaseClient } from "./types/database";

// --- Mock helpers ---

function makeRoom(overrides: Record<string, unknown> = {}) {
  return {
    id: "room-1",
    code: "ABC123",
    game_type: "spyfall",
    status: "waiting",
    max_players: 12,
    host_player_id: null,
    current_round: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

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

type ChainResult = {
  data: unknown;
  error: unknown;
  count?: number | null;
};

/**
 * Creates a mock supabase client that tracks .from() calls and returns
 * configured responses based on table + operation.
 */
function createMockClient(
  handlers: Record<string, (chain: MockChain) => void>
) {
  const client = {
    from: (table: string) => {
      const chain = new MockChain();
      handlers[table]?.(chain);
      return chain;
    },
  };
  return client as unknown as TypedSupabaseClient;
}

class MockChain {
  private _result: ChainResult = { data: null, error: null };
  private _singleResult: ChainResult | null = null;
  private _insertResults: ChainResult[] = [];
  private _insertCallCount = 0;

  // Configure default result
  result(data: unknown, error: unknown = null) {
    this._result = { data, error };
    return this;
  }

  // Configure result for .single()
  singleResult(data: unknown, error: unknown = null) {
    this._singleResult = { data, error };
    return this;
  }

  // Configure sequential insert results
  insertResults(results: ChainResult[]) {
    this._insertResults = results;
    return this;
  }

  // Chainable query methods — return `this`
  select() {
    return this;
  }
  insert() {
    if (this._insertResults.length > 0) {
      const idx = Math.min(
        this._insertCallCount,
        this._insertResults.length - 1
      );
      this._insertCallCount++;
      const r = this._insertResults[idx] ?? this._result;
      this._result = r;
      this._singleResult = r;
    }
    return this;
  }
  update() {
    return this;
  }
  delete() {
    return this;
  }
  eq() {
    return this;
  }
  ilike() {
    return this;
  }
  order() {
    return this;
  }

  single() {
    if (this._singleResult) return Promise.resolve(this._singleResult);
    return Promise.resolve(this._result);
  }

  toPromise() {
    return Promise.resolve(this._result);
  }
}

// --- Tests ---

describe("createRoom", () => {
  it("creates a room and host player successfully", async () => {
    const room = makeRoom();
    const player = makePlayer();

    const client = createMockClient({
      rooms: (chain) => {
        chain.insertResults([
          { data: room, error: null },
          // update call — no need for result
        ]);
        chain.result(null, null);
      },
      players: (chain) => {
        chain.singleResult(player, null);
      },
    });

    const result = await createRoom(client, "spyfall", "Alice", null);
    expect(result.room.code).toBe("ABC123");
    expect(result.player.nickname).toBe("Alice");
    expect(result.room.host_player_id).toBe("player-1");
  });

  it("retries on unique code violation (23505)", async () => {
    const room = makeRoom();
    const player = makePlayer();
    let insertCount = 0;

    const client = {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            insert: () => {
              insertCount++;
              return {
                select: () => ({
                  single: () => {
                    if (insertCount < 3) {
                      return Promise.resolve({
                        data: null,
                        error: { code: "23505" },
                      });
                    }
                    return Promise.resolve({ data: room, error: null });
                  },
                }),
              };
            },
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
            delete: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
          };
        }
        // players
        return {
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: player, error: null }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;

    const result = await createRoom(client, "spyfall", "Alice", null);
    expect(insertCount).toBe(3);
    expect(result.room.code).toBe("ABC123");
  });

  it("throws CREATE_FAILED on non-duplicate insert error", async () => {
    const client = {
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: { code: "42000", message: "other error" },
              }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    await expect(createRoom(client, "spyfall", "Alice", null)).rejects.toThrow(
      RoomOperationError
    );
    await expect(
      createRoom(client, "spyfall", "Alice", null)
    ).rejects.toMatchObject({ code: "CREATE_FAILED" });
  });

  it("throws CREATE_FAILED and cleans up room if player insert fails", async () => {
    const room = makeRoom();
    let roomDeleted = false;

    const client = {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            insert: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: room, error: null }),
              }),
            }),
            delete: () => ({
              eq: () => {
                roomDeleted = true;
                return Promise.resolve({ data: null, error: null });
              },
            }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
          };
        }
        // players — fail
        return {
          insert: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "insert failed" },
                }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;

    await expect(
      createRoom(client, "spyfall", "Alice", null)
    ).rejects.toMatchObject({ code: "CREATE_FAILED" });
    expect(roomDeleted).toBe(true);
  });

  it("throws CREATE_FAILED after exhausting all code attempts", async () => {
    const client = {
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: { code: "23505" },
              }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    await expect(
      createRoom(client, "spyfall", "Alice", null)
    ).rejects.toMatchObject({ code: "CREATE_FAILED" });
  });
});

describe("joinRoom", () => {
  function createJoinClient(overrides: {
    room?: unknown;
    roomError?: unknown;
    playerCount?: number | null;
    existingPlayers?: unknown[];
    insertedPlayer?: unknown;
    insertError?: unknown;
  }) {
    const {
      room = makeRoom(),
      roomError = null,
      playerCount = 1,
      existingPlayers = [],
      insertedPlayer = makePlayer({ is_host: false, nickname: "Bob" }),
      insertError = null,
    } = overrides;

    let selectCallCount = 0;

    return {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: room, error: roomError }),
              }),
            }),
          };
        }
        // players
        return {
          select: (_cols: string, opts?: Record<string, unknown>) => {
            if (opts?.head) {
              // count query
              return {
                eq: () =>
                  Promise.resolve({
                    count: playerCount,
                    data: null,
                    error: null,
                  }),
              };
            }
            selectCallCount++;
            if (selectCallCount === 1) {
              // nickname check
              return {
                eq: () => ({
                  ilike: () =>
                    Promise.resolve({ data: existingPlayers, error: null }),
                }),
              };
            }
            // insert select chain won't come here
            return { eq: () => Promise.resolve({ data: [], error: null }) };
          },
          insert: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({ data: insertedPlayer, error: insertError }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;
  }

  it("joins a room successfully", async () => {
    const client = createJoinClient({});
    const result = await joinRoom(client, "ABC123", "Bob", null);
    expect(result.room.code).toBe("ABC123");
    expect(result.player.nickname).toBe("Bob");
  });

  it("throws ROOM_NOT_FOUND when room does not exist", async () => {
    const client = createJoinClient({
      room: null,
      roomError: { code: "PGRST116" },
    });
    await expect(joinRoom(client, "XXXXXX", "Bob", null)).rejects.toMatchObject(
      {
        code: "ROOM_NOT_FOUND",
      }
    );
  });

  it("throws ROOM_NOT_WAITING when game already started", async () => {
    const client = createJoinClient({ room: makeRoom({ status: "playing" }) });
    await expect(joinRoom(client, "ABC123", "Bob", null)).rejects.toMatchObject(
      {
        code: "ROOM_NOT_WAITING",
      }
    );
  });

  it("throws ROOM_FULL when at max capacity", async () => {
    const client = createJoinClient({ playerCount: 12 });
    await expect(joinRoom(client, "ABC123", "Bob", null)).rejects.toMatchObject(
      {
        code: "ROOM_FULL",
      }
    );
  });

  it("throws NICKNAME_TAKEN when nickname exists (case-insensitive)", async () => {
    const client = createJoinClient({
      existingPlayers: [{ id: "existing-player" }],
    });
    await expect(
      joinRoom(client, "ABC123", "Alice", null)
    ).rejects.toMatchObject({
      code: "NICKNAME_TAKEN",
    });
  });

  it("throws CREATE_FAILED when player insert fails", async () => {
    const client = createJoinClient({
      insertedPlayer: null,
      insertError: { message: "failed" },
    });
    await expect(joinRoom(client, "ABC123", "Bob", null)).rejects.toMatchObject(
      {
        code: "CREATE_FAILED",
      }
    );
  });

  it("converts room code to uppercase", async () => {
    let capturedCode = "";
    const room = makeRoom();
    const player = makePlayer({ is_host: false });

    const client = {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            select: () => ({
              eq: (_col: string, val: string) => {
                capturedCode = val;
                return {
                  single: () => Promise.resolve({ data: room, error: null }),
                };
              },
            }),
          };
        }
        return {
          select: (_cols: string, opts?: Record<string, unknown>) => {
            if (opts?.head) {
              return {
                eq: () =>
                  Promise.resolve({ count: 1, data: null, error: null }),
              };
            }
            return {
              eq: () => ({
                ilike: () => Promise.resolve({ data: [], error: null }),
              }),
            };
          },
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: player, error: null }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;

    await joinRoom(client, "abc123", "Bob", null);
    expect(capturedCode).toBe("ABC123");
  });
});

describe("getRoom", () => {
  it("returns room data when found", async () => {
    const room = makeRoom();
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: room, error: null }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    const result = await getRoom(client, "ABC123");
    expect(result).toEqual(room);
  });

  it("returns null when room not found", async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { code: "PGRST116" } }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    const result = await getRoom(client, "XXXXXX");
    expect(result).toBeNull();
  });
});

describe("getRoomWithPlayers", () => {
  it("returns room with players", async () => {
    const room = makeRoom();
    const players = [
      makePlayer(),
      makePlayer({ id: "player-2", nickname: "Bob" }),
    ];

    const client = {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: room, error: null }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: players, error: null }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;

    const result = await getRoomWithPlayers(client, "ABC123");
    expect(result).not.toBeNull();
    expect(result!.room.code).toBe("ABC123");
    expect(result!.players).toHaveLength(2);
  });

  it("returns null when room not found", async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { code: "PGRST116" } }),
          }),
        }),
      }),
    } as unknown as TypedSupabaseClient;

    const result = await getRoomWithPlayers(client, "XXXXXX");
    expect(result).toBeNull();
  });

  it("returns empty players array when no players exist", async () => {
    const room = makeRoom();
    const client = {
      from: (table: string) => {
        if (table === "rooms") {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: room, error: null }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        };
      },
    } as unknown as TypedSupabaseClient;

    const result = await getRoomWithPlayers(client, "ABC123");
    expect(result!.players).toEqual([]);
  });
});
