// GET /api/tiktok/callback
// Handles the TikTok OAuth callback.
// 1. Verifies the state token (CSRF protection)
// 2. Exchanges the authorization code for access + refresh tokens
// 3. Fetches the user's TikTok profile info
// 4. Creates or updates the SocialAccount record in Prisma

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { exchangeCodeForTokens, calculateTokenExpiry } from "@/lib/tiktok";
import { getUserInfo } from "@/lib/tiktok";
import { prisma } from "@/lib/prisma";

const STATE_COOKIE = "tiktok_oauth_state";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // ─── Handle TikTok errors ──────────────────────────────────
  if (error) {
    const errorDescription = searchParams.get("error_description") ?? "Authorization denied";
    console.warn("TikTok OAuth error:", error, errorDescription);
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(errorDescription)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/connect?error=missing_parameters", request.url));
  }

  // ─── Verify state token (CSRF protection) ──────────────────
  const cookieStore = await cookies();
  const savedState = cookieStore.get(STATE_COOKIE)?.value;

  // Clear the state cookie immediately
  cookieStore.delete(STATE_COOKIE);

  if (!savedState || savedState !== state) {
    console.warn("TikTok OAuth state mismatch — possible CSRF attack");
    return NextResponse.redirect(new URL("/connect?error=invalid_state", request.url));
  }

  // ─── Verify PostPilot user is authenticated ────────────────
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=session_expired", request.url));
  }

  try {
    // ─── Exchange code for tokens ─────────────────────────────
    const tokenResponse = await exchangeCodeForTokens(code);

    // ─── Fetch TikTok user profile ────────────────────────────
    const tiktokUser = await getUserInfo(tokenResponse.access_token);

    // ─── Store or update SocialAccount ────────────────────────
    const providerAccountId = tokenResponse.open_id; // TikTok's unique user ID
    const now = new Date();

    // Upsert: update if exists, create if new
    // The unique constraint is on [provider, providerAccountId]
    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: "TIKTOK",
          providerAccountId,
        },
      },
      update: {
        // Update profile info from TikTok
        username: tiktokUser.username ?? "unknown",
        displayName: tiktokUser.display_name ?? null,
        avatarUrl: tiktokUser.avatar_url ?? null,
        bio: tiktokUser.bio_description ?? null,
        followers: tiktokUser.follower_count ?? 0,
        following: tiktokUser.following_count ?? 0,
        totalLikes: tiktokUser.likes_count ?? 0,
        totalVideos: tiktokUser.video_count ?? 0,
        isVerified: tiktokUser.is_verified ?? false,
        // Update tokens
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: calculateTokenExpiry(tokenResponse.expires_in),
        refreshTokenExpiresAt: calculateTokenExpiry(tokenResponse.refresh_expires_in),
        scopes: tokenResponse.scope,
        connectedAt: now,
      },
      create: {
        userId: user.id,
        provider: "TIKTOK",
        providerAccountId,
        username: tiktokUser.username ?? "unknown",
        displayName: tiktokUser.display_name ?? null,
        avatarUrl: tiktokUser.avatar_url ?? null,
        bio: tiktokUser.bio_description ?? null,
        followers: tiktokUser.follower_count ?? 0,
        following: tiktokUser.following_count ?? 0,
        totalLikes: tiktokUser.likes_count ?? 0,
        totalVideos: tiktokUser.video_count ?? 0,
        isVerified: tiktokUser.is_verified ?? false,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: calculateTokenExpiry(tokenResponse.expires_in),
        refreshTokenExpiresAt: calculateTokenExpiry(tokenResponse.refresh_expires_in),
        scopes: tokenResponse.scope,
      },
    });

    // ─── Success — redirect to connect page ───────────────────
    return NextResponse.redirect(new URL("/connect?success=tiktok_connected", request.url));
  } catch (err) {
    console.error("TikTok callback error:", err);
    const message = err instanceof Error ? err.message : "connection_failed";
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(message)}`, request.url));
  }
}
