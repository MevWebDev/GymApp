import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    let exercises;

    if (search) {
      exercises = await prisma.exercise.findMany({
        where: {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { bodyPart: { contains: String(search), mode: "insensitive" } },
            { target: { contains: String(search), mode: "insensitive" } },
          ],
        },
        orderBy: { name: "asc" },
      });
    } else {
      exercises = await prisma.exercise.findMany({
        orderBy: { name: "asc" },
      });
    }

    if (exercises.length === 0) {
      console.warn("No exercises found, using fallback data.");

      return;
    }

    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises, returning backup data:", error);
  }
});

// Fetch exercise by ID
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
