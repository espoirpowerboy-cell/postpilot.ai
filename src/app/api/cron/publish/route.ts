// Vercel Cron Job: Auto-publish scheduled TikTok videos.
// Runs every minute via Vercel Cron.
// Protected by VERCEL_CRON_SECRET to prevent unauthorized access.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initDirectPost, getVideoPublishStatus } from "@/lib/tiktok/content-posting";
import { getValidTikTokAccessToken } from "@/lib/tiktok/token-manager";

// Vercel Cron secret — set in Vercel project settings
const CRON_SECRET = process.env.VERCEL_CRON_SECRET;

export async function GET(request: NextRequest) {
  // ─── 1. Verify cron secret ───────────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let processed = 0;
  let published = 0;
  let failed = 0;
  let checked = 0;

  try {
    // ─── 2. Find all posts due for publishing ─────────────────────
    const duePosts = await prisma.post.findMany({
      where: {
        status: "SCHEDULED",
        scheduledDate: { lte: now },
      },
      include: {
        socialAccount: true,
        user: true,
      },
    });

    checked = duePosts.length;

    for (const post of duePosts) {
      processed++;

      // Skip if no linked TikTok account
      if (!post.socialAccount?.accessToken) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: "FAILED",
            publishError: "No connected TikTok account with valid access token",
          },
        });
        failed++;
        continue;
      }

      try {
        // ─── 3. Get a valid access token (refreshes if expired) ─────
        const accessToken = await getValidTikTokAccessToken(post.socialAccount);

        // ─── 4. Determine video URL from post content ──────────────
        // Post content should be a video URL for TikTok publishing
        const videoUrl = post.content?.trim();
        if (!videoUrl || !videoUrl.startsWith("http")) {
          await prisma.post.update({
            where: { id: post.id },
            data: {
              status: "FAILED",
              publishError: "Post content is not a valid video URL",
            },
          });
          failed++;
          continue;
        }

        // ─── 5. Publish to TikTok via Content Posting API ──────────
        const result = await initDirectPost(
          accessToken,
          videoUrl,
          post.title, // caption
          "PUBLIC_TO_EVERYONE",
        );

        // ─── 6. Save the publish_id for status tracking ────────────
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: "PUBLISHED", // Will be updated to PUBLISH_COMPLETE via status check
            publishId: result.publish_id,
            publishedDate: now,
            publishError: null,
          },
        });

        published++;

        // ─── 7. Check publish status (fire-and-forget) ─────────────
        // TikTok processes the video asynchronously — check status after a delay
        checkPublishStatusLater(result.publish_id, accessToken, post.id).catch(
          (err) => console.error(`[cron] Status check failed for post ${post.id}:`, err),
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown publish error";

        console.error(`[cron] Failed to publish post ${post.id}:`, errorMessage);

        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: "FAILED",
            publishError: errorMessage,
          },
        });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      checked,
      processed,
      published,
      failed,
    });
  } catch (error) {
    console.error("[cron] Publish cron error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}

/**
 * Check the publish status after a delay.
 * TikTok processes videos asynchronously — we poll once after ~10s.
 * If PUBLISH_COMPLETE → keep status as PUBLISHED.
 * If PUBLISH_FAILED → mark as FAILED with the error.
 */
async function checkPublishStatusLater(
  publishId: string,
  accessToken: string,
  postId: string,
): Promise<void> {
  // Wait 10 seconds for TikTok to process
  await new Promise((resolve) => setTimeout(resolve, 10_000));

  try {
    const status = await getVideoPublishStatus(accessToken, publishId);

    if (status.status === "PUBLISH_COMPLETE") {
      // Everything is fine — keep status as PUBLISHED
      await prisma.post.update({
        where: { id: postId },
        data: { publishError: null },
      });
    } else if (status.status === "PUBLISH_FAILED") {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "FAILED",
          publishError: status.fail_reason ?? "TikTok rejected the video",
        },
      });
    }
    // If PROCESSING_DOWNLOAD — leave as-is, TikTok is still processing
  } catch (error) {
    console.error(`[cron] Status check error for post ${postId}:`, error);
  }
}
