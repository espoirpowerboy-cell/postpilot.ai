import { NextResponse } from "next/server";
import {
  getAnalyticsOverview,
  getViewsOverTime,
  getEngagementBreakdown,
  getTopPosts,
  getAudienceDemographics,
  getAudienceGrowth,
} from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");

    switch (view) {
      case "views":
        return NextResponse.json({ data: await getViewsOverTime(userId) });
      case "engagement":
        return NextResponse.json({ data: await getEngagementBreakdown(userId) });
      case "top-posts":
        return NextResponse.json({ data: await getTopPosts(userId) });
      case "demographics":
        return NextResponse.json({ data: await getAudienceDemographics() });
      case "growth":
        return NextResponse.json({ data: await getAudienceGrowth() });
      default: {
        const overview = await getAnalyticsOverview(userId);
        return NextResponse.json(overview);
      }
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
