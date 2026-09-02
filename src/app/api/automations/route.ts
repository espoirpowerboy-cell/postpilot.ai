import { NextResponse } from "next/server";
import { getAutomations } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const automations = await getAutomations(userId);
    return NextResponse.json({ automations });
  } catch (error) {
    console.error("Automations API error:", error);
    return NextResponse.json(
      { error: "Failed to load automations" },
      { status: 500 }
    );
  }
}
