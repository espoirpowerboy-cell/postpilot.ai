// Database availability helper.
// If DATABASE_URL is set and the DB is reachable, use it.
// Otherwise, gracefully fall back to mock data for development/demo.

import { prisma } from "@/lib/prisma";

export type DatabaseStatus = {
  configured: boolean;
  connected: boolean;
  latencyMs: number | null;
  error: string | null;
  lastChecked: Date | null;
};

let _lastStatus: DatabaseStatus | null = null;
let _lastCheck = 0;
const CHECK_INTERVAL_MS = 30_000; // Re-check every 30 seconds

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  const now = Date.now();
  if (_lastStatus && now - _lastCheck < CHECK_INTERVAL_MS) {
    return _lastStatus;
  }

  if (!process.env.DATABASE_URL) {
    _lastStatus = {
      configured: false,
      connected: false,
      latencyMs: null,
      error: "DATABASE_URL not configured",
      lastChecked: new Date(),
    };
    _lastCheck = now;
    return _lastStatus;
  }

  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    _lastStatus = {
      configured: true,
      connected: true,
      latencyMs,
      error: null,
      lastChecked: new Date(),
    };
  } catch (e) {
    _lastStatus = {
      configured: true,
      connected: false,
      latencyMs: null,
      error: e instanceof Error ? e.message : "Unknown error",
      lastChecked: new Date(),
    };
  }
  _lastCheck = now;
  return _lastStatus;
}

// Fast async check — returns true only if DB is configured AND reachable.
export async function isDatabaseAvailable(): Promise<boolean> {
  const status = await getDatabaseStatus();
  return status.connected;
}

// Synchronous check — only reliable after getDatabaseStatus() has been called.
export function isDatabaseAvailableSync(): boolean {
  return _lastStatus?.connected ?? false;
}

// Reset cache — useful after connection settings change.
export function resetDatabaseStatus(): void {
  _lastStatus = null;
  _lastCheck = 0;
}
