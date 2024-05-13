-- AlterTable
ALTER TABLE "habit_week_days" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "habits" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT;
