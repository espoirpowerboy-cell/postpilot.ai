// Automations data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";

export interface AutomationData {
  id: number;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  runs: number;
  lastRun: string;
  successRate: number;
}

export async function getAutomations(userId?: string): Promise<AutomationData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return [];
  }

  const dbAutomations = await prisma.automationRule.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return dbAutomations.map(mapAutomation);
}

export async function getAutomationById(id: string): Promise<AutomationData | null> {
  if (!(await isDatabaseAvailable())) {
    return null;
  }

  const automation = await prisma.automationRule.findUnique({ where: { id } });
  return automation ? mapAutomation(automation) : null;
}

export async function createAutomation(
  userId: string,
  data: { name: string; description?: string; trigger: string; action: string }
): Promise<AutomationData> {
  const automation = await prisma.automationRule.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      action: data.action,
    },
  });

  return mapAutomation(automation);
}

export async function toggleAutomation(id: string): Promise<AutomationData> {
  const current = await prisma.automationRule.findUnique({ where: { id } });
  if (!current) throw new Error("Automation not found");

  const updated = await prisma.automationRule.update({
    where: { id },
    data: { status: current.status === "ACTIVE" ? "PAUSED" : "ACTIVE" },
  });

  return mapAutomation(updated);
}

function mapAutomation(a: {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  action: string;
  status: string;
  runCount: number;
  lastRunAt: Date | null;
  successRate: number;
}): AutomationData {
  return {
    id: hashStringId(a.id),
    name: a.name,
    description: a.description ?? "",
    trigger: a.trigger,
    action: a.action,
    status: a.status.toLowerCase() as AutomationData["status"],
    runs: a.runCount,
    lastRun: a.lastRunAt ? timeAgo(a.lastRunAt) : "Never",
    successRate: a.successRate,
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`;
  return `${Math.floor(seconds / 86400)} day ago`;
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
