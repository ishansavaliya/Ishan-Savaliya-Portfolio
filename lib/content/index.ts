import type { PortfolioContent } from "@/types/content";
import { SEED } from "./seed";

/**
 * Synchronous content accessor used by client apps (Terminal, Finder, VS Code).
 * Returns the static SEED — always available, zero-latency, no network.
 *
 * The SEED is kept in lockstep with the database via supabase/seed.sql, so the
 * client UI and the DB never diverge. Server components / API routes that want
 * live DB rows (e.g. blog, messages, admin) use `getContentFromDb()` below.
 */
export function getContent(): PortfolioContent {
  return SEED;
}

export { SEED };
