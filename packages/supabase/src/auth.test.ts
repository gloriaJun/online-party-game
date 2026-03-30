import { describe, it, expect } from "vitest";
import { getOrCreateAnonymousUser } from "./auth";
import type { TypedSupabaseClient } from "./types/database";

function createMockClient(overrides: {
  getSession?: () => Promise<unknown>;
  signInAnonymously?: () => Promise<unknown>;
}) {
  return {
    auth: {
      getSession:
        overrides.getSession ??
        (() => Promise.resolve({ data: { session: null }, error: null })),
      signInAnonymously:
        overrides.signInAnonymously ??
        (() => Promise.resolve({ data: { user: null }, error: null })),
    },
  } as unknown as TypedSupabaseClient;
}

describe("getOrCreateAnonymousUser", () => {
  it("returns existing session user id", async () => {
    const client = createMockClient({
      getSession: () =>
        Promise.resolve({
          data: { session: { user: { id: "existing-user-123" } } },
          error: null,
        }),
    });

    const result = await getOrCreateAnonymousUser(client);
    expect(result).toBe("existing-user-123");
  });

  it("creates anonymous user when no session exists", async () => {
    const client = createMockClient({
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      signInAnonymously: () =>
        Promise.resolve({
          data: { user: { id: "new-anon-456" } },
          error: null,
        }),
    });

    const result = await getOrCreateAnonymousUser(client);
    expect(result).toBe("new-anon-456");
  });

  it("throws when signInAnonymously fails with error", async () => {
    const client = createMockClient({
      signInAnonymously: () =>
        Promise.resolve({
          data: { user: null },
          error: { message: "Auth disabled" },
        }),
    });

    await expect(getOrCreateAnonymousUser(client)).rejects.toThrow(
      "Failed to create anonymous session"
    );
  });

  it("throws when signInAnonymously returns no user", async () => {
    const client = createMockClient({
      signInAnonymously: () =>
        Promise.resolve({ data: { user: null }, error: null }),
    });

    await expect(getOrCreateAnonymousUser(client)).rejects.toThrow(
      "Failed to create anonymous session"
    );
  });
});
