-- AlterTable: Add publish tracking fields for TikTok auto-publish
ALTER TABLE "posts" ADD COLUMN "publish_id" TEXT,
ADD COLUMN "publish_error" TEXT;
