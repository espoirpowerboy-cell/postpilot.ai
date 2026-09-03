// GET /api/tiktok/connect
// Initiates the TikTok OAuth flow.
// Generates a secure state token, stores it in an httpOnly cookie,
// and redirects the user to TikTok's authorization page.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { buildAuthorizationUrl } from "@/lib/tiktok";

// Scopes requested from TikTok.
// Only request what you need — users may deny scopes they don't understand.
const TIKTOK_SCOPES = [
  "user.info.basic",  // Avatar + display name
  "user.info.profile", // Username, bio, verified status
  "user.info.stats",  // Follower count, video count, etc.
  "video.list",       // List user's public videos
  "video.publish",    // Direct video posting via Content Posting API
];

const STATE_COOKIE = "tiktok_oauth_state";
const STATE_MAX_AGE = 600; // 10 minutes

/**
 * Get the base URL of the PostPilot app.
 * Priority: NEXT_PUBLIC_APP_URL > request headers > localhost fallback.
 */
function getAppBaseUrl(request: Request): string {
  // 1. Explicit app URL env var
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. Construct from request headers
  const url = new URL(request.url);
  return url.origin;
}

export async function GET(request: Request) {
  try {
    // 1. Verify the PostPilot user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Generate a cryptographically random state token
    const stateArray = new Uint8Array(32);
    crypto.getRandomValues(stateArray);
    const state = Array.from(stateArray, (b) => b.toString(16).padStart(2, "0")).join("");

    // 3. Store state in a signed, httpOnly cookie for verification on callback
    const cookieStore = await cookies();
    cookieStore.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: STATE_MAX_AGE,
      path: "/",
    });

    // 4. Build the TikTok authorization URL and redirect
    const authUrl = buildAuthorizationUrl(TIKTOK_SCOPES, state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("TikTok connect error:", error);
    // FIX: Use the app's own URL, not the Supabase project URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(new URL("/connect?error=init_failed", baseUrl));
  }
}
