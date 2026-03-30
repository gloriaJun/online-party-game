import { createClient } from "@supabase/supabase-js";
import type { Database, TypedSupabaseClient } from "./types/database";

let _client: TypedSupabaseClient | null = null;

export function getSupabaseClient(): TypedSupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      );
    }
    _client = createClient<Database>(url, key);
  }
  return _client;
}

/** @deprecated Use getSupabaseClient() instead */
export const supabase = new Proxy({} as TypedSupabaseClient, {
  get(_, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[
      prop
    ];
  },
});
