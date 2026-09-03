// Social accounts data access functions.

import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "./db";

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
    return getEmptyAccount();
  }

  const account = await prisma.socialAccount.findFirst({
    where: { userId, provider: "TIKTOK" },
  });

  if (!account) {
    return getEmptyAccount();
  }

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

function getEmptyAccount(): SocialAccountData {
  return {
    username: "",
    displayName: "",
    followers: 0,
    following: 0,
    likes: 0,
    videos: 0,
    verified: false,
    bio: "",
    profileViews: 0,
    isProAccount: false,
    connected: false,
  };
}
