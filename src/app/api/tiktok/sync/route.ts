import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { fullTikTokSync } from "@/lib/tiktok/sync";

export async function POST() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fullTikTokSync(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Sync failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      videosSynced: result.videosSynced,
      profileUpdated: result.profileUpdated,
    });
  } catch (error) {
    console.error("TikTok sync error:", error);
    return NextResponse.json(
      { error: "Sync failed. Please try again." },
      { status: 500 }
    );
  }
}
