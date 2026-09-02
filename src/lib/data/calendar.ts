// Calendar data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { calendarEvents as mockEvents } from "@/lib/mock-data";

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "scheduled" | "draft" | "published";
  type: "video" | "reel" | "image";
}

export async function getCalendarEvents(userId?: string): Promise<CalendarEvent[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockEvents;
  }

  const posts = await prisma.post.findMany({
    where: {
      userId,
      OR: [
        { scheduledDate: { not: null } },
        { status: "PUBLISHED" },
        { status: "DRAFT" },
      ],
    },
    orderBy: { scheduledDate: "asc" },
    take: 30,
  });

  return posts.map((p, i) => ({
    id: i + 1,
    title: p.title,
    date: (p.scheduledDate ?? p.publishedDate ?? p.createdAt).toISOString().split("T")[0],
    time: (p.scheduledDate ?? p.publishedDate ?? p.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    platform: "TikTok",
    status: p.status.toLowerCase() as CalendarEvent["status"],
    type: "video" as const,
  }));
}
