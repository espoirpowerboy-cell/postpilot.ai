// Clients data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { clients as mockClients } from "@/lib/mock-data";

export interface ClientData {
  id: number;
  name: string;
  industry: string;
  status: "active" | "paused" | "prospect";
  postsManaged: number;
  followers: number;
  engagement: string;
  revenue: string;
  nextPost: string | null;
  avatar: string;
}

export async function getClients(userId?: string): Promise<ClientData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockClients;
  }

  const dbClients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return dbClients.map(mapClient);
}

export async function getClientById(id: string): Promise<ClientData | null> {
  if (!(await isDatabaseAvailable())) {
    return mockClients.find((c) => c.id.toString() === id) ?? null;
  }

  const client = await prisma.client.findUnique({ where: { id } });
  return client ? mapClient(client) : null;
}

export async function createClient(
  userId: string,
  data: { name: string; industry?: string; status?: string; monthlyRevenue?: number; notes?: string }
): Promise<ClientData> {
  const client = await prisma.client.create({
    data: {
      userId,
      name: data.name,
      industry: data.industry,
      status: (data.status?.toUpperCase() ?? "ACTIVE") as "ACTIVE" | "PAUSED" | "PROSPECT",
      monthlyRevenue: data.monthlyRevenue,
      notes: data.notes,
    },
  });

  return mapClient(client);
}

export async function updateClient(
  id: string,
  data: { name?: string; industry?: string; status?: string; monthlyRevenue?: number | null; notes?: string | null }
): Promise<ClientData> {
  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.industry !== undefined && { industry: data.industry }),
      ...(data.status !== undefined && { status: data.status.toUpperCase() as "ACTIVE" | "PAUSED" | "PROSPECT" | "ARCHIVED" }),
      ...(data.monthlyRevenue !== undefined && { monthlyRevenue: data.monthlyRevenue }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  return mapClient(client);
}

function mapClient(c: {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  postsManaged: number;
  followers: number;
  engagementRate: number | null;
  monthlyRevenue: import("@prisma/client").Prisma.Decimal | null;
  nextPostDate: Date | null;
}): ClientData {
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: hashStringId(c.id),
    name: c.name,
    industry: c.industry ?? "Other",
    status: c.status.toLowerCase() as ClientData["status"],
    postsManaged: c.postsManaged,
    followers: c.followers,
    engagement: c.engagementRate ? `${c.engagementRate}%` : "N/A",
    revenue: c.monthlyRevenue ? `$${c.monthlyRevenue.toLocaleString()}/mo` : "Pending",
    nextPost: c.nextPostDate?.toISOString().split("T")[0] ?? null,
    avatar: initials,
  };
}

function hashStringId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash) % 100000;
}
