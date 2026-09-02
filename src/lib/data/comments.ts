// Comments data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { comments as mockComments } from "@/lib/mock-data";
import type { Prisma } from "@prisma/client";

export interface CommentData {
  id: number;
  author: string;
  avatar: string;
  content: string;
  post: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  replied: boolean;
}

export async function getComments(
  userId?: string,
  filters?: { sentiment?: string; search?: string }
): Promise<CommentData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    let result = mockComments;
    if (filters?.sentiment && filters.sentiment !== "all") {
      result = result.filter((c) => c.sentiment === filters.sentiment);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) => c.content.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
      );
    }
    return result;
  }

  const where: Prisma.CommentWhereInput = { userId };
  if (filters?.sentiment && filters.sentiment !== "all") {
    where.sentiment = filters.sentiment.toUpperCase() as Prisma.EnumCommentSentimentFilter["equals"];
  }
  if (filters?.search) {
    where.OR = [
      { content: { contains: filters.search, mode: "insensitive" } },
      { authorName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const dbComments = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true } } },
  });

  return dbComments.map(mapComment);
}

export async function getCommentById(id: string): Promise<CommentData | null> {
  if (!(await isDatabaseAvailable())) {
    return mockComments.find((c) => c.id.toString() === id) ?? null;
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { post: { select: { title: true } } },
  });

  return comment ? mapComment(comment) : null;
}

export async function replyToComment(
  commentId: string,
  replyContent: string
): Promise<CommentData> {
  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      replied: true,
      repliedAt: new Date(),
      replyContent,
    },
    include: { post: { select: { title: true } } },
  });

  return mapComment(comment);
}

function mapComment(comment: {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  sentiment: string;
  replied: boolean;
  createdAt: Date;
  post?: { title: string } | null;
}): CommentData {
  return {
    id: hashStringId(comment.id),
    author: `@${comment.authorName}`,
    avatar: comment.authorName.slice(0, 2).toUpperCase(),
    content: comment.content,
    post: comment.post?.title ?? "Unknown post",
    time: timeAgo(comment.createdAt),
    sentiment: comment.sentiment.toLowerCase() as CommentData["sentiment"],
    replied: comment.replied,
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
