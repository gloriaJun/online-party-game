import { createClient } from "@supabase/supabase-js";
import type { Database } from "@repo/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
