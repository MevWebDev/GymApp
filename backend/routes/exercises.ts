import { Router } from "express";
import prisma from "../prisma/prisma";

const router = Router();

// Fetch all exercises or search by name, bodyPart, or target
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    console.log("Search:", search);

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
      return res.json(exercises);
    }

    // Fetch all exercises
    const allExercises = await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
    res.json(allExercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID:", id);

    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(id) },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
