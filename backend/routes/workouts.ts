import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image, userId, exercises } = req.body;

    // Validate the input
    if (!title || !userId) {
      return res.status(400).json({ error: "Title and userId are required." });
    }

    // Create the workout plan
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId },
        },
        image,
      },
    });

    if (exercises && Array.isArray(exercises) && exercises.length > 0) {
      await prisma.workoutPlanExercise.createMany({
        data: exercises.map((exerciseId: number) => ({
          workoutPlanId: workoutPlan.id,
          exerciseId: exerciseId,
          reps: 10,
        })),
      });
    }

    const fullWorkoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlan.id },
      include: {
        exercises: { include: { exercise: true } }, // Include exercise details
      },
    });

    res.status(201).json(fullWorkoutPlan);
  } catch (error) {
    console.error("Error creating workout plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const workoutPlans = await prisma.workoutPlan.findMany({
      include: { user: true, exercises: { include: { exercise: true } } },
    });
    res.json(workoutPlans);
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: Number(id) },
      include: { user: true, exercises: { include: { exercise: true } } },
    });

    if (!workoutPlan) {
      res.status(404).json({ error: "Workout plan not found" });
      return;
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error("Error fetching workout plan by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
