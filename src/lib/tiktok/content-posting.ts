// TikTok Content Posting API service — server-side only.
// Provides video publishing capabilities via TikTok's official Content Posting API.
//
// IMPORTANT: video.publish scope requires TikTok app approval/audit.
// Until approved, all posts will be restricted to private viewing mode.
// Unaudited clients can only post to private accounts.

import { getCreatorInfo } from "./api";

const TIKTOK_API_BASE = "https://open.tiktokapis.com/v2";

// ─── Types ───────────────────────────────────────────────────

export interface VideoInitRequest {
  post_info: {
    title: string;
    privacy_level: string;
    disable_duet?: boolean;
    disable_stitch?: boolean;
    disable_comment?: boolean;
    video_cover_timestamp_ms?: number;
    brand_content_toggle?: boolean;
    brand_organic_toggle?: boolean;
    is_aigc?: boolean;
  };
  source_info: {
    source: "PULL_FROM_URL" | "FILE_UPLOAD";
    video_url?: string;
    video_size?: number;
    chunk_size?: number;
    total_chunk_count?: number;
  };
}

export interface VideoInitResponse {
  publish_id: string;
  upload_url?: string;
}

export interface VideoStatusResponse {
  publish_id: string;
  status: "PUBLISH_COMPLETE" | "PROCESSING_DOWNLOAD" | "PUBLISH_FAILED" | "REVOKED";
  fail_reason?: string;
}

// ─── Video Publishing ────────────────────────────────────────

/**
 * Query creator info before posting.
 * Required by TikTok — must display this info to the user before posting.
 * Requires scope: video.publish
 */
export async function queryCreatorInfo(accessToken: string) {
  return getCreatorInfo(accessToken);
}

/**
 * Initialize a direct video post to TikTok.
 * Requires scope: video.publish
 *
 * @param accessToken - The user's TikTok access token
 * @param videoUrl    - Public URL of the video to post (PULL_FROM_URL)
 * @param title       - Video caption (max 2200 UTF-16 runes)
 * @param privacyLevel - One of: PUBLIC_TO_EVERYONE, MUTUAL_FOLLOW_FRIENDS, FOLLOWER_OF_CREATOR, SELF_ONLY
 */
export async function initDirectPost(
  accessToken: string,
  videoUrl: string,
  title: string,
  privacyLevel: string,
  options: {
    disableDuet?: boolean;
    disableStitch?: boolean;
    disableComment?: boolean;
    coverTimestampMs?: number;
    brandContentToggle?: boolean;
    brandOrganicToggle?: boolean;
    isAigc?: boolean;
  } = {},
): Promise<VideoInitResponse> {
  const body: VideoInitRequest = {
    post_info: {
      title,
      privacy_level: privacyLevel,
      disable_duet: options.disableDuet ?? false,
      disable_stitch: options.disableStitch ?? false,
      disable_comment: options.disableComment ?? false,
      video_cover_timestamp_ms: options.coverTimestampMs,
      brand_content_toggle: options.brandContentToggle ?? false,
      brand_organic_toggle: options.brandOrganicToggle ?? false,
      is_aigc: options.isAigc ?? false,
    },
    source_info: {
      source: "PULL_FROM_URL",
      video_url: videoUrl,
    },
  };

  const response = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (data.error?.code !== "ok") {
    const errorMsg = data.error?.message ?? "Unknown error";
    const errorCode = data.error?.code ?? "unknown";

    // Surface specific error codes with clear, actionable messages
    switch (errorCode) {
      case "unaudited_client_can_only_post_to_private_accounts":
        throw new Error(
          "Your TikTok app has not been audited yet. Posts are restricted to private viewing. Please complete the TikTok app audit to enable public posting.",
        );
      case "spam_risk_too_many_posts":
        throw new Error(
          "Daily post limit reached for this TikTok account. Please try again tomorrow.",
        );
      case "spam_risk_user_banned_from_posting":
        throw new Error(
          "This TikTok account has been banned from posting via the API.",
        );
      case "reached_active_user_cap":
        throw new Error(
          "The daily quota for active publishing users from your app has been reached. Please try again tomorrow or contact TikTok support.",
        );
      case "scope_not_authorized":
        throw new Error(
          "The video.publish scope has not been authorized. Please reconnect your TikTok account with the required permissions.",
        );
      case "privacy_level_option_mismatch":
        throw new Error(
          "The selected privacy level is not available for this TikTok account. Check the account's privacy settings on TikTok.",
        );
      case "url_ownership_unverified":
        throw new Error(
          "The video URL domain has not been verified with TikTok. For PULL_FROM_URL, the domain must be pre-approved in your TikTok Developer Portal settings.",
        );
      case "access_token_invalid":
        throw new Error(
          "TikTok access token is invalid or has expired. Please reconnect your TikTok account.",
        );
      default:
        throw new Error(
          `TikTok video init failed: ${errorMsg} (code: ${errorCode})`,
        );
    }
  }

  return data.data;
}

/**
 * Check the status of a published video.
 * Requires scope: video.publish
 *
 * @param publishId - The publish_id returned from initDirectPost
 */
export async function getVideoPublishStatus(
  accessToken: string,
  publishId: string,
): Promise<VideoStatusResponse> {
  const response = await fetch(`${TIKTOK_API_BASE}/post/publish/status/fetch/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ publish_id: publishId }),
  });

  const data = await response.json();

  if (data.error?.code !== "ok") {
    throw new Error(`TikTok publish status failed: ${data.error?.message ?? "Unknown error"}`);
  }

  return data.data;
}
