// TikTok OAuth 2.0 service.
// All token operations happen server-side. Tokens never reach the browser.

const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_REVOKE_URL = "https://open.tiktokapis.com/v2/oauth/revoke/";

// ─── Types ───────────────────────────────────────────────────

export interface TikTokTokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface TikTokTokenError {
  error: string;
  error_description: string;
  log_id: string;
}

// ─── Config ──────────────────────────────────────────────────

function getClientKey(): string {
  const key = process.env.TIKTOK_CLIENT_KEY;
  if (!key) throw new Error("TIKTOK_CLIENT_KEY is not configured");
  return key;
}

function getClientSecret(): string {
  const secret = process.env.TIKTOK_CLIENT_SECRET;
  if (!secret) throw new Error("TIKTOK_CLIENT_SECRET is not configured");
  return secret;
}

function getRedirectUri(): string {
  const uri = process.env.TIKTOK_REDIRECT_URI;
  if (!uri) throw new Error("TIKTOK_REDIRECT_URI is not configured");
  return uri;
}

// ─── Authorization URL ───────────────────────────────────────

/**
 * Build the TikTok OAuth authorization URL.
 *
 * @param scopes - Array of scopes to request
 * @param state  - CSRF protection state token
 * @returns Full URL to redirect the user to
 */
export function buildAuthorizationUrl(scopes: string[], state: string): string {
  const params = new URLSearchParams({
    client_key: getClientKey(),
    response_type: "code",
    scope: scopes.join(","),
    redirect_uri: getRedirectUri(),
    state,
  });

  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

// ─── Exchange code for tokens ────────────────────────────────

/**
 * Exchange an authorization code for access + refresh tokens.
 * Called server-side only.
 */
export async function exchangeCodeForTokens(code: string): Promise<TikTokTokenResponse> {
  const body = new URLSearchParams({
    client_key: getClientKey(),
    client_secret: getClientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: getRedirectUri(),
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: body.toString(),
  });

  const data = await response.json();

  // TikTok returns errors at the top level (not in an "error" field like most APIs)
  if (data.error) {
    const err = data as TikTokTokenError;
    throw new Error(`TikTok token exchange failed: ${err.error_description} (log_id: ${err.log_id})`);
  }

  return data as TikTokTokenResponse;
}

// ─── Refresh tokens ──────────────────────────────────────────

/**
 * Refresh an access token using the refresh token.
 * The returned refresh_token may differ from the one sent — always store the new one.
 */
export async function refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
  const body = new URLSearchParams({
    client_key: getClientKey(),
    client_secret: getClientSecret(),
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (data.error) {
    const err = data as TikTokTokenError;
    throw new Error(`TikTok token refresh failed: ${err.error_description} (log_id: ${err.log_id})`);
  }

  return data as TikTokTokenResponse;
}

// ─── Revoke token ────────────────────────────────────────────

/**
 * Revoke a user's access token (disconnect TikTok account).
 */
export async function revokeAccessToken(accessToken: string): Promise<void> {
  const body = new URLSearchParams({
    client_key: getClientKey(),
    client_secret: getClientSecret(),
    token: accessToken,
  });

  const response = await fetch(TIKTOK_REVOKE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: body.toString(),
  });

  const data = await response.json();

  // Revocation is best-effort — log but don't throw
  if (data.error && data.error !== "ok") {
    console.warn("TikTok token revoke warning:", data.error_description);
  }
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Calculate the token expiry DateTime from the expires_in seconds.
 */
export function calculateTokenExpiry(expiresIn: number): Date {
  return new Date(Date.now() + expiresIn * 1000);
}
