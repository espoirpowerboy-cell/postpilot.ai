// Social accounts data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";
import { tiktokAccount as mockAccount } from "@/lib/mock-data";

export interface SocialAccountData {
  id?: string;
  username: string;
  displayName: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  verified: boolean;
  bio: string;
  profileViews: number;
  isProAccount: boolean;
  connected: boolean;
  avatarUrl?: string | null;
  connectedAt?: Date | null;
}

export async function getSocialAccount(userId?: string): Promise<SocialAccountData> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return { ...mockAccount, connected: false };
  }

  const account = await prisma.socialAccount.findFirst({
    where: { userId, provider: "TIKTOK" },
  });

  if (!account) {
    // No real TikTok account connected — return mock data with connected: false
    return { ...mockAccount, connected: false };
  }

  // Real TikTok account found — return real data
  return {
    id: account.id,
    username: `@${account.username}`,
    displayName: account.displayName ?? account.username,
    followers: account.followers,
    following: account.following,
    likes: account.totalLikes,
    videos: account.totalVideos,
    verified: account.isVerified,
    bio: account.bio ?? "",
    profileViews: account.profileViews,
    isProAccount: account.isProAccount,
    connected: true,
    avatarUrl: account.avatarUrl,
    connectedAt: account.connectedAt,
  };
}

export async function getSocialAccounts(userId?: string) {
  if (!(await isDatabaseAvailable()) || !userId) {
    return [];
  }

  return prisma.socialAccount.findMany({
    where: { userId },
    select: {
      id: true,
      provider: true,
      username: true,
      displayName: true,
      followers: true,
      avatarUrl: true,
      connectedAt: true,
    },
  });
}

/**
 * Check if a TikTok account is connected and tokens are present.
 */
export async function isTikTokConnected(userId: string): Promise<boolean> {
  if (!(await isDatabaseAvailable()) || !userId) {
    return false;
  }

  const account = await prisma.socialAccount.findFirst({
    where: { userId, provider: "TIKTOK" },
    select: { id: true, accessToken: true },
  });

  return !!(account?.accessToken);
}
