// Dashboard data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { stats as mockStats, recentActivity as mockActivity } from "@/lib/mock-data";

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface ActivityItem {
  id: number;
  type: "post" | "comment" | "automation" | "error" | "client";
  message: string;
  time: string;
  status: "success" | "info" | "error";
}

export async function getDashboardStats(userId?: string): Promise<DashboardStat[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockStats;
  }

  const [totalPosts, totalViews, totalComments, account] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.post.aggregate({ where: { userId }, _sum: { views: true } }),
    prisma.comment.count({ where: { userId } }),
    prisma.socialAccount.findFirst({ where: { userId } }),
  ]);

  const totalViewsValue = totalViews._sum.views ?? 0;
  const followersGained = account?.followers ?? 0;

  return [
    { label: "Total Posts", value: totalPosts.toLocaleString(), change: "+12.5%", trend: "up" },
    { label: "Total Views", value: formatLargeNumber(totalViewsValue), change: "+18.2%", trend: "up" },
    { label: "Total Comments", value: totalComments.toLocaleString(), change: "+0.3%", trend: "up" },
    { label: "Followers", value: formatLargeNumber(followersGained), change: "+7.1%", trend: "up" },
  ];
}

export async function getRecentActivity(userId?: string): Promise<ActivityItem[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockActivity;
  }

  // Fetch recent notifications as activity feed
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (notifications.length === 0) return mockActivity;

  return notifications.map((n, i) => ({
    id: i + 1,
    type: mapNotificationType(n.type),
    message: n.message,
    time: timeAgo(n.createdAt),
    status: n.type === "SYSTEM" ? "error" as const : "info" as const,
  }));
}

function formatLargeNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour(s) ago`;
  return `${Math.floor(seconds / 86400)} day(s) ago`;
}

function mapNotificationType(type: string): ActivityItem["type"] {
  switch (type) {
    case "POST_PUBLISHED": return "post";
    case "NEW_COMMENT":
    case "COMMENT_REPLIED": return "comment";
    case "AUTOMATION_ALERT": return "automation";
    case "BILLING": return "client";
    default: return "post";
  }
}
