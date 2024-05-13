/*
  Warnings:

  - You are about to drop the column `dateime` on the `habit_week_days` table. All the data in the column will be lost.
  - Added the required column `datetime` to the `habit_week_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit_week_days" DROP COLUMN "dateime",
ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL;
