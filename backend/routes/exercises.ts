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

// Backup Fake Exercises (fallback data)
const backupExercises = [
  {
    id: 1,
    name: "Bench Press",
    bodyPart: "Chest",
    target: "Pectorals",
    equipment: "Barbell",
    gifUrl: "https://v2.exercisedb.io/image/BXrZhlUNxPHhOy",
  },
  {
    id: 2,
    name: "Pull up",
    bodyPart: "Back",
    target: "Lats",
    equipment: "Body weight",
    gifUrl: "https://v2.exercisedb.io/image/ofWCs7IGMXGqo3",
  },
  {
    id: 3,
    name: "Bicep Curl",
    bodyPart: "Arms",
    target: "Biceps",
    equipment: "Dumbbells",
    gifUrl: "https://v2.exercisedb.io/image/fk7AdkyPnl2YPr",
  },
  {
    id: 4,
    name: "Cable lateral raise",
    bodyPart: "Shoulders",
    target: "Deltoids",
    equipment: "Cable",
    gifUrl: "https://v2.exercisedb.io/image/10Q3MQWiqlAb-y",
  },
  {
    id: 5,
    name: "Deadlift",
    bodyPart: "Upper legs",
    target: "Glutes",
    equipment: "Barbell",
    gifUrl: "https://v2.exercisedb.io/image/RSlXN4NDtfoTah",
  },
  {
    id: 6,
    name: "Cable kneeling crunch",
    bodyPart: "Core",
    target: "Abdominals",
    equipment: "Cable",
    gifUrl: "https://v2.exercisedb.io/image/CkgicLze48lmRC",
  },
];

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
      res.json(backupExercises);
      return;
    }

    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises, returning backup data:", error);
    res.json(backupExercises);
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
