import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

router.delete("/save", async (req: Request, res: Response): Promise<void> => {
  const { userId, workoutPlanId } = req.body;
  if (!userId || !workoutPlanId) {
    res.status(400).json({ error: "Missing userId or workoutPlanId." });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savedWorkoutPlans: {
          disconnect: { id: Number(workoutPlanId) },
        },
      },
      include: { savedWorkoutPlans: true },
    });
    res.status(200).json(updatedUser.savedWorkoutPlans);
  } catch (error: any) {
    console.error("Error unsaving workout plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image, userId, exercises } = req.body;

    if (!title || !userId) {
      res.status(400).json({ error: "Title and userId are required." });
      return;
    }

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        title,
        description,
        image,
        user: { connect: { id: userId } },
      },
    });

    if (Array.isArray(exercises) && exercises.length > 0) {
      await prisma.workoutPlanExercise.createMany({
        data: exercises.map((exercise) => ({
          workoutPlanId: workoutPlan.id,
          exerciseId: exercise.exerciseId,
          reps: exercise.reps,
          sets: exercise.sets,
        })),
      });
    }

    const fullWorkoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlan.id },
      include: {
        user: true,
        exercises: { include: { exercise: true } },
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
    const { search } = req.query;

    let workoutPlans;

    if (search) {
      workoutPlans = await prisma.workoutPlan.findMany({
        where: {
          title: { contains: String(search), mode: "insensitive" },
        },
        include: {
          user: true,
          exercises: { include: { exercise: true } },
        },
      });
    } else {
      workoutPlans = await prisma.workoutPlan.findMany({
        include: {
          user: true,
          exercises: { include: { exercise: true } },
        },
        orderBy: { id: "desc" },
      });
    }

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
      include: {
        user: true,
        exercises: { include: { exercise: true } },
      },
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

router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, image, exercises } = req.body;

    const workoutPlan = await prisma.workoutPlan.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        image,
      },
    });

    if (Array.isArray(exercises) && exercises.length > 0) {
      await prisma.workoutPlanExercise.deleteMany({
        where: { workoutPlanId: workoutPlan.id },
      });

      await prisma.workoutPlanExercise.createMany({
        data: exercises.map((exercise) => ({
          workoutPlanId: workoutPlan.id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
        })),
      });
    }

    const fullWorkoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlan.id },
      include: {
        user: true,
        exercises: { include: { exercise: true } },
      },
    });

    res.json(fullWorkoutPlan);
  } catch (error) {
    console.error("Error updating workout plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.workoutPlanExercise.deleteMany({
      where: { workoutPlanId: Number(id) },
    });

    await prisma.workoutPlan.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/save", async (req: Request, res: Response): Promise<void> => {
  const { userId, workoutPlanId } = req.body;
  if (!userId || !workoutPlanId) {
    res.status(400).json({ error: "Missing userId or workoutPlanId." });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savedWorkoutPlans: {
          connect: { id: Number(workoutPlanId) },
        },
      },
      include: { savedWorkoutPlans: true },
    });
    res.status(200).json(updatedUser.savedWorkoutPlans);
  } catch (error: any) {
    console.error("Error saving workout plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
