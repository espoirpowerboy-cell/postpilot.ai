// TikTok integration — barrel export.
// All TikTok operations happen server-side only.

export {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  revokeAccessToken,
  calculateTokenExpiry,
} from "./oauth";

export {
  getUserInfo,
  getVideoList,
  getCreatorInfo,
  isTokenValid,
} from "./api";

export {
  queryCreatorInfo,
  initDirectPost,
  getVideoPublishStatus,
} from "./content-posting";

export {
  getValidTikTokAccessToken,
  TikTokTokenExpiredError,
} from "./token-manager";

export type { TokenInfo } from "./token-manager";
export type { TikTokTokenResponse } from "./oauth";
export type { TikTokUserInfo, TikTokVideoItem, TikTokCreatorInfo, TikTokVideoListData } from "./api";
export type { VideoInitRequest, VideoInitResponse, VideoStatusResponse } from "./content-posting";
