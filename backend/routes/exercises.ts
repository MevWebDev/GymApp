import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";
import updateGifUrls from "../scripts/updateGifs";

const router = Router();

setInterval(async () => {
  console.log("Running the GIF update job...");
  try {
    await updateGifUrls();
    console.log("GIF update job completed successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during GIF update job:", error.message);
    }
  }
}, 3600 * 1000);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    if (search) {
      const exercises = await prisma.exercise.findMany({
        where: {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { bodyPart: { contains: String(search), mode: "insensitive" } },
            { target: { contains: String(search), mode: "insensitive" } },
          ],
        },
        orderBy: { name: "asc" },
      });
      res.json(exercises);
      return;
    }

    const allExercises = await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
    res.json(allExercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(id) },
    });

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
