// Posts data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import type { Prisma } from "@prisma/client";

export interface PostData {
  id: number;
  title: string;
  content: string | null;
  platform: string;
  status: "published" | "scheduled" | "draft";
  scheduledDate: string | null;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  thumbnail: null;
}

export async function getPosts(
  userId?: string,
  filters?: { status?: string; search?: string }
): Promise<PostData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return [];
  }

  const where: Prisma.PostWhereInput = { userId };
  if (filters?.status && filters.status !== "all") {
    where.status = filters.status.toUpperCase() as Prisma.EnumPostStatusFilter["equals"];
  }
  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }

  const dbPosts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return dbPosts.map(mapPost);
}

export async function getScheduledPosts(userId?: string): Promise<PostData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return [];
  }

  const dbPosts = await prisma.post.findMany({
    where: { userId, status: "SCHEDULED" },
    orderBy: { scheduledDate: "asc" },
    take: 10,
  });

  return dbPosts.map(mapPost);
}

export async function getPostById(id: string): Promise<PostData | null> {
  if (!(await isDatabaseAvailable())) {
    return null;
  }

  const post = await prisma.post.findUnique({ where: { id } });
  return post ? mapPost(post) : null;
}

export async function createPost(
  userId: string,
  data: { title: string; content?: string; status?: string; scheduledDate?: Date | null; platform?: string }
): Promise<PostData> {
  const post = await prisma.post.create({
    data: {
      userId,
      title: data.title,
      content: data.content,
      status: (data.status?.toUpperCase() ?? "DRAFT") as Prisma.EnumPostStatusFieldUpdateOperationsInput["set"],
      platform: (data.platform?.toUpperCase() ?? "TIKTOK") as Prisma.EnumSocialProviderFieldUpdateOperationsInput["set"],
      scheduledDate: data.scheduledDate,
    },
  });

  return mapPost(post);
}

export async function updatePost(
  id: string,
  data: { title?: string; content?: string; status?: string; scheduledDate?: Date | null }
): Promise<PostData> {
  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.status !== undefined && { status: data.status.toUpperCase() as Prisma.EnumPostStatusFieldUpdateOperationsInput["set"] }),
      ...(data.scheduledDate !== undefined && { scheduledDate: data.scheduledDate }),
    },
  });

  return mapPost(post);
}

function mapPost(post: { id: string; title: string; content: string | null; status: string; scheduledDate: Date | null; likes: number; commentsCount: number; shares: number; views: number }): PostData {
  return {
    id: hashStringId(post.id),
    title: post.title,
    content: post.content,
    platform: "TikTok",
    status: post.status.toLowerCase() as PostData["status"],
    scheduledDate: post.scheduledDate?.toISOString().split("T")[0] ?? null,
    likes: post.likes,
    comments: post.commentsCount,
    shares: post.shares,
    views: post.views,
    thumbnail: null,
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
