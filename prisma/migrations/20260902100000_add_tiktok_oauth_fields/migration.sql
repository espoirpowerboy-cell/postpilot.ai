-- AlterTable: Add TikTok OAuth fields to social_accounts
ALTER TABLE "social_accounts" ADD COLUMN "is_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "social_accounts" ADD COLUMN "refresh_token_expires_at" TIMESTAMP(3);
ALTER TABLE "social_accounts" ADD COLUMN "scopes" TEXT;
