// Supabase client for Next.js middleware.
// Refreshes the auth session on every request to keep cookies valid.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  //
  // IMPORTANT: Do NOT remove supabase.auth.getUser(). It is required for
  // middleware to refresh the session correctly.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Public routes (no auth required) ──────────────────────
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthCallback = pathname.startsWith("/auth/");
  const isRoot = pathname === "/";

  // Redirect logged-in users away from public auth pages
  if (user && (isPublicRoute || isRoot)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow public routes, auth callback, and root (landing page)
  if (isPublicRoute || isAuthCallback || isRoot) {
    return supabaseResponse;
  }

  // ─── Protected routes ───────────────────────────────────────
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Optionally preserve the intended destination
    // url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
