import { NextResponse } from "next/server";
import { getDashboardStats, getRecentActivity } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [stats, activity] = await Promise.all([
      getDashboardStats(userId),
      getRecentActivity(userId),
    ]);

    return NextResponse.json({ stats, activity });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
