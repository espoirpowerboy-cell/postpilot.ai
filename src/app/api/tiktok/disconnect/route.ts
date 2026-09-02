// POST /api/tiktok/disconnect
// Disconnects the user's TikTok account.
// 1. Revokes the access token with TikTok (best-effort)
// 2. Deletes the SocialAccount record from Prisma

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revokeAccessToken } from "@/lib/tiktok";

export async function POST() {
  try {
    // 1. Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the TikTok SocialAccount
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user.id,
        provider: "TIKTOK",
      },
    });

    if (!socialAccount) {
      return NextResponse.json({ error: "No TikTok account connected" }, { status: 404 });
    }

    // 3. Revoke the token with TikTok (best-effort — don't fail if revoke fails)
    if (socialAccount.accessToken) {
      try {
        await revokeAccessToken(socialAccount.accessToken);
      } catch (err) {
        // Log but continue — local cleanup is more important
        console.warn("TikTok token revoke failed (continuing with local cleanup):", err);
      }
    }

    // 4. Delete the SocialAccount record
    // This cascades to related Posts and Comments via onDelete
    await prisma.socialAccount.delete({
      where: { id: socialAccount.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TikTok disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect TikTok account" },
      { status: 500 },
    );
  }
}
