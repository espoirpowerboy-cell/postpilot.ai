import { NextResponse } from "next/server";
import { getNotifications, getUnreadNotificationCount } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("count") === "true";

    if (countOnly) {
      const count = await getUnreadNotificationCount(userId);
      return NextResponse.json({ count });
    }

    const notifications = await getNotifications(userId);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
