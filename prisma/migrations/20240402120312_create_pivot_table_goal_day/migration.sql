-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_day_id_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_user_id_fkey";

-- CreateTable
CREATE TABLE "GoalDay" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GoalDay_id_key" ON "GoalDay"("id");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalDay" ADD CONSTRAINT "GoalDay_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalDay" ADD CONSTRAINT "GoalDay_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
