import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

export async function getOrCreateAnonymousUser(
  client: SupabaseClient<Database>
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
