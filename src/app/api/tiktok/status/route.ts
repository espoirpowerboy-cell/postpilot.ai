// GET /api/tiktok/status
// Returns the current user's TikTok connection status and profile info.
// NEVER returns access tokens or refresh tokens to the client.

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Only return accounts with a real accessToken.
    // This prevents seed/demo data (no accessToken) from being shown as connected.
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user.id,
        provider: "TIKTOK",
        accessToken: { not: null },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        followers: true,
        following: true,
        totalLikes: true,
        totalVideos: true,
        isVerified: true,
        isProAccount: true,
        profileViews: true,
        connectedAt: true,
      },
    });

    if (!socialAccount) {
      return NextResponse.json({ account: null });
    }

    // Return profile data only — NEVER return tokens
    return NextResponse.json({
      account: {
        id: socialAccount.id,
        username: `@${socialAccount.username}`,
        displayName: socialAccount.displayName ?? socialAccount.username,
        avatarUrl: socialAccount.avatarUrl,
        bio: socialAccount.bio,
        followers: socialAccount.followers,
        following: socialAccount.following,
        likes: socialAccount.totalLikes,
        videos: socialAccount.totalVideos,
        verified: socialAccount.isVerified,
        isProAccount: socialAccount.isProAccount,
        profileViews: socialAccount.profileViews,
        connected: true,
        connectedAt: socialAccount.connectedAt,
      },
    });
  } catch (error) {
    console.error("TikTok status error:", error);
    return NextResponse.json({ account: null });
  }
}
