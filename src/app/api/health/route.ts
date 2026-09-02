import { NextResponse } from "next/server";
import { getDatabaseStatus } from "@/lib/data/db";

export async function GET() {
  const status = await getDatabaseStatus();

  return NextResponse.json(
    {
      status: status.connected ? "healthy" : status.configured ? "unhealthy" : "not_configured",
      database: {
        configured: status.configured,
        connected: status.connected,
        latencyMs: status.latencyMs,
        error: status.error,
      },
      timestamp: new Date().toISOString(),
    },
    { status: status.connected ? 200 : status.configured ? 503 : 200 }
  );
}
