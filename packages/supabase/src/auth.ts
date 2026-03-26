import type { TypedSupabaseClient } from "./types/database";

export async function getOrCreateAnonymousUser(
  client: TypedSupabaseClient
): Promise<string> {
  const {
    data: { session },
  } = await client.auth.getSession();

  if (session?.user?.id) {
    return session.user.id;
  }

  const { data, error } = await client.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error("Failed to create anonymous session");
  }
  return data.user.id;
}
