import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 proxy (formerly middleware) — guards /is-control-portal and refreshes session.
export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/is-control-portal/:path*"],
};
