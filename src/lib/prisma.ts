// Prisma client singleton.
// Prevents multiple Prisma Client instances in development (hot-reload).
// NEVER import this file in client components — it exposes DB access.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  // No DATABASE_URL — create client without adapter.
  // Data layer functions will detect this and fall back to mock data.
  // NOTE: Any actual DB query through this instance will throw, which is
  // caught by the isDatabaseAvailable() check in the data layer.
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
