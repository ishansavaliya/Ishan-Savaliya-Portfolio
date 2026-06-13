"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Returns true when public Supabase env vars are present. */
export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Browser Supabase client (anon key). Null when not configured. */
export function createClient() {
  if (!hasSupabase()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
