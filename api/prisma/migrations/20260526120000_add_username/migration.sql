-- Add username column with default from id, then make it required
ALTER TABLE "users" ADD COLUMN "username" TEXT;
UPDATE "users" SET "username" = 'user_' || SUBSTRING("id"::TEXT, 1, 8) WHERE "username" IS NULL;
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE ("username");

-- Make email optional
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
