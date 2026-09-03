// TikTok Sync Service — fetches real data from TikTok API and syncs to database.
// Server-side only. Called after OAuth callback and periodically.

import { prisma } from "@/lib/prisma";
import { getValidTikTokAccessToken, TikTokTokenExpiredError } from "./token-manager";
import { getUserInfo, getVideoList } from "./api";

// ─── Types ───────────────────────────────────────────────────

interface SyncResult {
  success: boolean;
  videosSynced: number;
  profileUpdated: boolean;
  error?: string;
}

// ─── Sync User Profile ───────────────────────────────────────

/**
 * Sync the TikTok user profile to the SocialAccount record.
 * Called after OAuth callback and on manual refresh.
 */
export async function syncTikTokProfile(userId: string): Promise<SyncResult> {
  const account = await prisma.socialAccount.findFirst({
    where: { userId, provider: "TIKTOK" },
  });

  if (!account?.accessToken) {
    return { success: false, videosSynced: 0, profileUpdated: false, error: "No TikTok account connected" };
  }

  try {
    const accessToken = await getValidTikTokAccessToken(account);
    const userInfo = await getUserInfo(accessToken);

    // Update SocialAccount with real TikTok data
    await prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        username: userInfo.username ?? account.username,
        displayName: userInfo.display_name ?? account.displayName,
        avatarUrl: userInfo.avatar_url ?? userInfo.avatar_url_100 ?? account.avatarUrl,
        bio: userInfo.bio_description ?? account.bio,
        followers: userInfo.follower_count ?? account.followers,
        following: userInfo.following_count ?? account.following,
        totalLikes: userInfo.likes_count ?? account.totalLikes,
        totalVideos: userInfo.video_count ?? account.totalVideos,
        isVerified: userInfo.is_verified ?? account.isVerified,
      },
    });

    return { success: true, videosSynced: 0, profileUpdated: true };
  } catch (error) {
    if (error instanceof TikTokTokenExpiredError) {
      return { success: false, videosSynced: 0, profileUpdated: false, error: "TikTok token expired. Please reconnect." };
    }
    return { success: false, videosSynced: 0, profileUpdated: false, error: String(error) };
  }
}

// ─── Sync Videos ─────────────────────────────────────────────

/**
 * Fetch videos from TikTok API and sync them to the Post table.
 * Uses cursor-based pagination to fetch all available videos.
 * Deduplicates by TikTok video ID.
 */
export async function syncTikTokVideos(userId: string, maxPages = 5): Promise<SyncResult> {
  const account = await prisma.socialAccount.findFirst({
    where: { userId, provider: "TIKTOK" },
  });

  if (!account?.accessToken) {
    return { success: false, videosSynced: 0, profileUpdated: false, error: "No TikTok account connected" };
  }

  try {
    const accessToken = await getValidTikTokAccessToken(account);
    let videosSynced = 0;
    let cursor = 0;
    let hasMore = true;

    for (let page = 0; page < maxPages && hasMore; page++) {
      const videoData = await getVideoList(accessToken, cursor, 20);
      const videos = videoData.videos ?? [];

      for (const video of videos) {
        // Upsert by TikTok external ID to avoid duplicates
        const existingPost = await prisma.post.findFirst({
          where: { externalId: video.id },
        });

        if (existingPost) {
          // Update stats for existing videos
          await prisma.post.update({
            where: { id: existingPost.id },
            data: {
              views: video.view_count,
              likes: video.like_count,
              commentsCount: video.comment_count,
              shares: video.share_count,
            },
          });
        } else {
          // Create new post from TikTok video
          await prisma.post.create({
            data: {
              userId,
              socialAccountId: account.id,
              title: video.title || `TikTok Video ${video.id}`,
              content: video.title ?? null,
              status: "PUBLISHED",
              platform: "TIKTOK",
              externalId: video.id,
              publishedDate: new Date(video.create_time * 1000),
              views: video.view_count,
              likes: video.like_count,
              commentsCount: video.comment_count,
              shares: video.share_count,
            },
          });
          videosSynced++;
        }
      }

      hasMore = videoData.has_more;
      cursor = videoData.cursor;
    }

    // Also sync profile data
    const profileResult = await syncTikTokProfile(userId);

    return {
      success: true,
      videosSynced,
      profileUpdated: profileResult.profileUpdated,
    };
  } catch (error) {
    if (error instanceof TikTokTokenExpiredError) {
      return { success: false, videosSynced: 0, profileUpdated: false, error: "TikTok token expired. Please reconnect." };
    }
    return { success: false, videosSynced: 0, profileUpdated: false, error: String(error) };
  }
}

// ─── Full Sync ───────────────────────────────────────────────

/**
 * Complete sync: profile + videos. Called from API routes.
 */
export async function fullTikTokSync(userId: string): Promise<SyncResult> {
  const profileResult = await syncTikTokProfile(userId);
  const videoResult = await syncTikTokVideos(userId);

  return {
    success: profileResult.success && videoResult.success,
    videosSynced: videoResult.videosSynced,
    profileUpdated: profileResult.profileUpdated,
    error: profileResult.error ?? videoResult.error,
  };
}
