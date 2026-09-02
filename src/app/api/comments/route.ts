import { NextResponse } from "next/server";
import { getComments } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sentiment = searchParams.get("sentiment") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const comments = await getComments(userId, { sentiment, search });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments API error:", error);
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}
