// Supabase Auth callback route.
// Handles:
// - OAuth provider redirects (Google, etc.)
// - Email confirmation links
// - Password reset links
//
// After exchanging the code for a session, syncs the user with Prisma
// and redirects to the appropriate page.

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // The user is now authenticated.
      // The getCurrentUser() function in auth.ts will handle Prisma sync
      // when it's first called after this redirect.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
