-- AlterTable: Add supabase_user_id column for Supabase Auth integration
ALTER TABLE "users" ADD COLUMN "supabase_user_id" TEXT;

-- CreateUniqueIndex: Unique constraint on supabase_user_id
CREATE UNIQUE INDEX "users_supabase_user_id_key" ON "users"("supabase_user_id");
