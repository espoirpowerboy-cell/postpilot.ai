// Analytics data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { analyticsData as mockAnalytics, stats as mockStats } from "@/lib/mock-data";
import type { DashboardStat } from "./dashboard";

export interface ViewsDataPoint {
  date: string;
  views: number;
}

export interface FollowersDataPoint {
  date: string;
  followers: number;
}

export interface EngagementData {
  type: string;
  count: number;
  percentage: number;
}

export interface TopPostData {
  title: string;
  views: number;
  likes: number;
  engagement: string;
}

export interface AgeDemographic {
  range: string;
  percentage: number;
}

export interface GenderDemographic {
  type: string;
  percentage: number;
}

export interface LocationDemographic {
  city: string;
  percentage: number;
}

export interface AudienceDemographics {
  age: AgeDemographic[];
  gender: GenderDemographic[];
  topLocations: LocationDemographic[];
}

export interface AnalyticsOverview {
  viewsOverTime: ViewsDataPoint[];
  engagementByType: EngagementData[];
  topPosts: TopPostData[];
  audienceGrowth: FollowersDataPoint[];
  demographics: AudienceDemographics;
}

export async function getAnalyticsOverview(userId?: string): Promise<AnalyticsOverview> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockAnalytics;
  }

  const posts = await prisma.post.findMany({
    where: { userId, status: "PUBLISHED" },
    orderBy: { publishedDate: "desc" },
  });

  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0);
  const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
  const totalEngagement = totalLikes + totalComments + totalShares;

  return {
    viewsOverTime: generateViewsOverTime(posts),
    engagementByType: [
      { type: "Likes", count: totalLikes, percentage: totalEngagement ? Math.round((totalLikes / totalEngagement) * 100) : 0 },
      { type: "Comments", count: totalComments, percentage: totalEngagement ? Math.round((totalComments / totalEngagement) * 100) : 0 },
      { type: "Shares", count: totalShares, percentage: totalEngagement ? Math.round((totalShares / totalEngagement) * 100) : 0 },
    ],
    topPosts: posts.slice(0, 5).map((p) => ({
      title: p.title,
      views: p.views,
      likes: p.likes,
      engagement: p.views > 0 ? `${((p.likes / p.views) * 100).toFixed(1)}%` : "0%",
    })),
    audienceGrowth: mockAnalytics.audienceGrowth, // Demographics come from social platform APIs
    demographics: mockAnalytics.demographics,
  };
}

export async function getViewsOverTime(userId?: string): Promise<ViewsDataPoint[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockAnalytics.viewsOverTime;
  }

  const posts = await prisma.post.findMany({
    where: { userId, status: "PUBLISHED" },
    orderBy: { publishedDate: "asc" },
  });

  return generateViewsOverTime(posts);
}

export async function getEngagementBreakdown(userId?: string): Promise<EngagementData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockAnalytics.engagementByType;
  }

  const posts = await prisma.post.findMany({ where: { userId } });
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0);
  const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
  const total = totalLikes + totalComments + totalShares || 1;

  return [
    { type: "Likes", count: totalLikes, percentage: Math.round((totalLikes / total) * 100) },
    { type: "Comments", count: totalComments, percentage: Math.round((totalComments / total) * 100) },
    { type: "Shares", count: totalShares, percentage: Math.round((totalShares / total) * 100) },
  ];
}

export async function getTopPosts(userId?: string): Promise<TopPostData[]> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return mockAnalytics.topPosts;
  }

  const posts = await prisma.post.findMany({
    where: { userId, status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: 5,
  });

  return posts.map((p) => ({
    title: p.title,
    views: p.views,
    likes: p.likes,
    engagement: p.views > 0 ? `${((p.likes / p.views) * 100).toFixed(1)}%` : "0%",
  }));
}

export async function getAudienceDemographics(): Promise<AudienceDemographics> {
  // Demographics require social platform API integration
  return mockAnalytics.demographics;
}

export async function getAudienceGrowth(): Promise<FollowersDataPoint[]> {
  // Audience growth tracking requires social platform API integration
  return mockAnalytics.audienceGrowth;
}

function generateViewsOverTime(posts: { publishedDate: Date | null; views: number }[]): ViewsDataPoint[] {
  // Group by date and sum views
  const byDate = new Map<string, number>();
  for (const p of posts) {
    if (!p.publishedDate) continue;
    const date = p.publishedDate.toISOString().split("T")[0];
    byDate.set(date, (byDate.get(date) ?? 0) + p.views);
  }

  const result = Array.from(byDate.entries()).map(([date, views]) => ({ date, views }));
  return result.length > 0 ? result : mockAnalytics.viewsOverTime;
}
