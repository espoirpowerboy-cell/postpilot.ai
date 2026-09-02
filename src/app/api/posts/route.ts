import { NextResponse } from "next/server";
import { getPosts, getScheduledPosts } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const scheduled = searchParams.get("scheduled") === "true";

    if (scheduled) {
      const posts = await getScheduledPosts(userId);
      return NextResponse.json({ posts });
    }

    const posts = await getPosts(userId, { status, search });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Posts API error:", error);
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  }
}
