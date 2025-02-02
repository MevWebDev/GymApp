import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    if (search) {
      const users = await prisma.user.findMany({
        where: {
          nick: { contains: String(search), mode: "insensitive" },
        },
        orderBy: { nick: "asc" },
      });
      res.json(users);
      return;
    }
    const allUsers = await prisma.user.findMany({
      orderBy: { followers: "desc" },
    });
    res.json(allUsers);
  } catch (error) {
    console.log("Error fetching users:", error);
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/:id/workouts",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const workoutPlans = await prisma.workoutPlan.findMany({
        where: { userId: id },
        include: {
          user: true,
          exercises: { include: { exercise: true } },
        },
      });

      if (!workoutPlans) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(workoutPlans);
    } catch (error) {
      console.error("Error fetching user workouts by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, nick, email } = req.body;

    const user = await prisma.user.create({
      data: {
        id,
        nick,
        email,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
