/*
  Warnings:

  - You are about to drop the column `hourAndMinutes` on the `habit_week_days` table. All the data in the column will be lost.
  - Added the required column `timeInSeconds` to the `habit_week_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit_week_days" DROP COLUMN "hourAndMinutes",
ADD COLUMN     "timeInSeconds" BIGINT NOT NULL;
