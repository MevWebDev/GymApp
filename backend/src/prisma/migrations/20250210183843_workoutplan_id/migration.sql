/*
  Warnings:

  - Added the required column `planId` to the `CompletedWorkout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedWorkout" ADD COLUMN     "planId" INTEGER NOT NULL;
