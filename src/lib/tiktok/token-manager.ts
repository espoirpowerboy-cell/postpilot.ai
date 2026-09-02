// TikTok Token Manager — lazy refresh with safety margin.
// Ensures a valid access token is always available for TikTok API calls.
// Refreshes transparently when the token is about to expire.
// All operations are server-side only.

import { prisma } from "@/lib/prisma";
import { refreshAccessToken, calculateTokenExpiry } from "./oauth";

// ─── Config ──────────────────────────────────────────────────

/** Refresh the access token this many seconds before it actually expires. */
const SAFETY_MARGIN_SECONDS = 3600; // 1 hour

// ─── Types ───────────────────────────────────────────────────

/** Minimal shape of a SocialAccount record needed for token management. */
export interface TokenInfo {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scopes: string | null;
}

// ─── Errors ──────────────────────────────────────────────────

export class TikTokTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TikTokTokenExpiredError";
  }
}

// ─── Core function ───────────────────────────────────────────

/**
 * Get a valid TikTok access token, refreshing it if necessary.
 *
 * Flow:
 * 1. If no access token → throw (account not connected)
 * 2. If no expiry info → return current token (legacy data)
 * 3. If token is valid with safety margin → return current token
 * 4. If token is expiring soon:
 *    a. Check refresh token is not expired
 *    b. Call TikTok refresh endpoint
 *    c. Update database with new tokens (TikTok may return a NEW refresh_token)
 *    d. Return new access token
 * 5. If refresh token is expired → throw TikTokTokenExpiredError
 *
 * Never loops. Never fabricates tokens. Never sends tokens to the browser.
 */
export async function getValidTikTokAccessToken(
  socialAccount: TokenInfo,
): Promise<string> {
  // ── No access token → not connected ────────────────────────
  if (!socialAccount.accessToken) {
    throw new TikTokTokenExpiredError(
      "No TikTok access token. Please reconnect your TikTok account.",
    );
  }

  // ── No expiry info → assume valid (legacy data) ────────────
  if (!socialAccount.tokenExpiresAt) {
    return socialAccount.accessToken;
  }

  const now = new Date();
  const expiryTime = new Date(socialAccount.tokenExpiresAt);
  const secondsUntilExpiry =
    (expiryTime.getTime() - now.getTime()) / 1000;

  // ── Token is still valid with safety margin → return it ────
  if (secondsUntilExpiry > SAFETY_MARGIN_SECONDS) {
    return socialAccount.accessToken;
  }

  // ── Token is expiring soon → need to refresh ───────────────
  if (!socialAccount.refreshToken) {
    throw new TikTokTokenExpiredError(
      "No refresh token available. Please reconnect your TikTok account.",
    );
  }

  // ── Check if refresh token itself is expired ───────────────
  if (socialAccount.refreshTokenExpiresAt) {
    const refreshExpiry = new Date(socialAccount.refreshTokenExpiresAt);
    if (refreshExpiry <= now) {
      throw new TikTokTokenExpiredError(
        "TikTok refresh token has expired. Please reconnect your TikTok account.",
      );
    }
  }

  // ── Call TikTok refresh endpoint ───────────────────────────
  const tokenResponse = await refreshAccessToken(socialAccount.refreshToken);

  // ── Update database with new tokens ────────────────────────
  // TikTok may return a DIFFERENT refresh_token — always store the new one.
  await prisma.socialAccount.update({
    where: { id: socialAccount.id },
    data: {
      accessToken: tokenResponse.access_token,
      tokenExpiresAt: calculateTokenExpiry(tokenResponse.expires_in),
      refreshToken: tokenResponse.refresh_token,
      refreshTokenExpiresAt: calculateTokenExpiry(
        tokenResponse.refresh_expires_in,
      ),
      scopes: tokenResponse.scope,
    },
  });

  return tokenResponse.access_token;
}
