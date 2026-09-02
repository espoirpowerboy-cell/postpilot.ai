import { NextResponse } from "next/server";
import { getClients } from "@/lib/data";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clients = await getClients(userId);
    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Clients API error:", error);
    return NextResponse.json(
      { error: "Failed to load clients" },
      { status: 500 }
    );
  }
}
