import { createClient } from "@supabase/supabase-js";
import type { Database } from "@repo/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

function getClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }
  return createClient<Database>(supabaseUrl, supabaseKey);
}

let _browserClient: ReturnType<typeof getClient> | null = null;

export function createBrowserClient() {
  if (!_browserClient) {
    _browserClient = getClient();
  }
  return _browserClient;
}

export function createServerClient() {
  // Server clients should NOT be cached — each request gets a fresh client
  return getClient();
}
