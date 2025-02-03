-- CreateTable
CREATE TABLE "_SavedWorkouts" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SavedWorkouts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SavedWorkouts_B_index" ON "_SavedWorkouts"("B");

-- AddForeignKey
ALTER TABLE "_SavedWorkouts" ADD CONSTRAINT "_SavedWorkouts_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedWorkouts" ADD CONSTRAINT "_SavedWorkouts_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
