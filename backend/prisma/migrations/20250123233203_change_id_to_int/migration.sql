/*
  Warnings:

  - The primary key for the `Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `exerciseId` on the `CompletedWorkoutExercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exerciseId` on the `WorkoutPlanExercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CompletedWorkoutExercise" DROP CONSTRAINT "CompletedWorkoutExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlanExercise" DROP CONSTRAINT "WorkoutPlanExercise_exerciseId_fkey";

-- AlterTable
ALTER TABLE "CompletedWorkoutExercise" DROP COLUMN "exerciseId",
ADD COLUMN     "exerciseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WorkoutPlanExercise" DROP COLUMN "exerciseId",
ADD COLUMN     "exerciseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutPlanExercise" ADD CONSTRAINT "WorkoutPlanExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedWorkoutExercise" ADD CONSTRAINT "CompletedWorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
