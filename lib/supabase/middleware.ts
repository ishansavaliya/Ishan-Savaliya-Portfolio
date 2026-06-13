import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session and guards /is-control-portal routes.
 * Unauthenticated users hitting /is-control-portal/* are redirected to /is-control-portal/login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return response;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith("/is-control-portal");
  const isLogin = path === "/is-control-portal/login";

  if (isAdmin && !isLogin && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/is-control-portal/login";
    return NextResponse.redirect(redirect);
  }
  if (isLogin && user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/is-control-portal";
    return NextResponse.redirect(redirect);
  }

  return response;
}
