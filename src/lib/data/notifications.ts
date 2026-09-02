// Notifications data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export async function getNotifications(userId?: string, limit: number = 20): Promise<NotificationData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return [
      { id: "1", type: "POST_PUBLISHED", title: "Post Published", message: "Your post \"10 Tips for Better Content\" is now live.", read: false, createdAt: new Date(Date.now() - 2 * 60 * 1000) },
      { id: "2", type: "NEW_COMMENT", title: "New Comment", message: "@sarah_designs commented on your post.", read: false, createdAt: new Date(Date.now() - 15 * 60 * 1000) },
      { id: "3", type: "AUTOMATION_ALERT", title: "Automation Alert", message: "Auto-reply sent to 3 comments successfully.", read: true, createdAt: new Date(Date.now() - 60 * 60 * 1000) },
    ];
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt,
  }));
}

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return 3;
  }

  return prisma.notification.count({
    where: { userId, read: false },
  });
}
