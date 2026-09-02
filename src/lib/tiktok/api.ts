// TikTok API v2 client — server-side only.
// Provides typed wrappers for TikTok's official REST APIs.

const TIKTOK_API_BASE = "https://open.tiktokapis.com/v2";

// ─── Types ───────────────────────────────────────────────────

export interface TikTokUserInfo {
  open_id: string;
  union_id?: string;
  avatar_url?: string;
  avatar_url_100?: string;
  avatar_large_url?: string;
  display_name?: string;
  bio_description?: string;
  profile_deep_link?: string;
  is_verified?: boolean;
  username?: string;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

export interface TikTokVideoItem {
  id: string;
  title: string;
  create_time: number;
  cover_image_url: string;
  duration: number;
  share_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
}

// FIX: TikTok v2 /video/list/ returns data.videos, not data.list.
// Response structure per docs: { data: { videos: [...], cursor, has_more }, error }
export interface TikTokVideoListData {
  videos: TikTokVideoItem[];
  cursor: number;
  has_more: boolean;
}

export interface TikTokCreatorInfo {
  creator_avatar_url: string;
  creator_username: string;
  creator_nickname: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
}

// ─── User Info ───────────────────────────────────────────────

/**
 * Fetch authorized user's profile info from TikTok.
 * Requires scope: user.info.basic (minimum), user.info.profile, user.info.stats (optional).
 *
 * @param accessToken - The user's TikTok access token
 * @param fields      - Comma-separated fields to request
 */
export async function getUserInfo(
  accessToken: string,
  fields = "open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count,is_verified,bio_description",
): Promise<TikTokUserInfo> {
  const params = new URLSearchParams({ fields });
  const response = await fetch(`${TIKTOK_API_BASE}/user/info/?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (data.error?.code !== "ok") {
    throw new Error(`TikTok user info failed: ${data.error?.message ?? "Unknown error"} (log_id: ${data.error?.log_id})`);
  }

  return data.data.user;
}

// ─── Video List ──────────────────────────────────────────────

// FIX: TikTok v2 video/list requires:
// - POST method
// - Content-Type: application/json (NOT form-urlencoded)
// - `fields` query parameter specifying which fields to return
// - Body: JSON with cursor and max_count
// - Response: data.videos (not data.list)

const VIDEO_LIST_FIELDS = "id,title,create_time,cover_image_url,duration,share_url,view_count,like_count,comment_count,share_count";

/**
 * Fetch the authorized user's video list.
 * Requires scope: video.list
 *
 * @param accessToken - The user's TikTok access token
 * @param cursor      - Pagination cursor (0 for first page, or timestamp from previous response)
 * @param maxCount    - Max items per page (default 20, max 20)
 */
export async function getVideoList(
  accessToken: string,
  cursor = 0,
  maxCount = 20,
): Promise<TikTokVideoListData> {
  const params = new URLSearchParams({ fields: VIDEO_LIST_FIELDS });
  const response = await fetch(`${TIKTOK_API_BASE}/video/list/?${params.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cursor,
      max_count: maxCount,
    }),
  });

  const data = await response.json();

  if (data.error?.code !== "ok") {
    throw new Error(`TikTok video list failed: ${data.error?.message ?? "Unknown error"} (log_id: ${data.error?.log_id})`);
  }

  return data.data;
}

// ─── Creator Info (for Content Posting) ──────────────────────

/**
 * Query creator info for Content Posting API.
 * Requires scope: video.publish (must be approved by TikTok)
 *
 * Returns privacy level options and interaction settings.
 */
export async function getCreatorInfo(accessToken: string): Promise<TikTokCreatorInfo> {
  const response = await fetch(`${TIKTOK_API_BASE}/post/publish/creator_info/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();

  if (data.error?.code !== "ok") {
    throw new Error(`TikTok creator info failed: ${data.error?.message ?? "Unknown error"} (log_id: ${data.error?.log_id})`);
  }

  return data.data;
}

// ─── Ensure valid token ──────────────────────────────────────

/**
 * Check if an access token is still valid by calling the user info endpoint.
 * Returns true if the token works, false if expired/invalid.
 */
export async function isTokenValid(accessToken: string): Promise<boolean> {
  try {
    await getUserInfo(accessToken, "open_id");
    return true;
  } catch {
    return false;
  }
}
