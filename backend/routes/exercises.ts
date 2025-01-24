import { Router } from "express";
import prisma from "../prisma/prisma";
import updateGifUrls from "../scripts/updateGifs";

const router = Router();

// Middleware to optionally update GIFs
async function tryUpdateGifUrls() {
  try {
    console.log("Updating GIF URLs...");
    await updateGifUrls();
    console.log("GIF URLs updated successfully.");
  } catch (error) {
    console.error("Error updating GIF URLs:", error.message);
  }
}

// Fetch all exercises or search by name, bodyPart, or target
router.get("/", async (req, res) => {
  // Call GIF update outside the main logic to avoid blocking the response
  tryUpdateGifUrls();

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
      console.log("Found exercises:", exercises);
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
    console.log("Fetching exercise by ID:", id);

    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(id) },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    console.log("Found exercise:", exercise);
    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
