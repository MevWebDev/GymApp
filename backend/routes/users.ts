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
    const allUsers = await prisma.user.findMany({});
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

    const followers = await prisma.userFollow.findMany({
      where: { followingId: id },
      include: { follower: true },
    });

    const following = await prisma.userFollow.findMany({
      where: { followerId: id },
      include: { following: true },
    });

    if (!user || !followers || !following) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const completeUser = {
      ...user,
      followers,
      following,
    };

    res.json(completeUser);
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
    const { id, nick, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        id,
        nick,
        email,
        password,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// @ts-ignore
router.patch("/update", async (req, res) => {
  const { id, nick, avatar } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User id is required." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        nick,
        avatar,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the profile." });
  }
});

router.get(
  "/:userId/saved-workouts",
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
      const userWithSaved = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          savedWorkoutPlans: {
            include: {
              user: true,
              exercises: {
                include: {
                  exercise: true,
                },
              },
            },
          },
        },
      });

      if (!userWithSaved) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      res.status(200).json(userWithSaved.savedWorkoutPlans);
    } catch (error: any) {
      console.error("Error fetching saved workouts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/follow", async (req: Request, res: Response): Promise<void> => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    res.status(400).json({ error: "Missing followerId or followingId." });
    return;
  }

  try {
    const userFollow = await prisma.userFollow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(200).json(userFollow);
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// @ts-ignore
router.delete("/unfollow", async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ error: "Missing userId or followerId." });
  }

  try {
    const deletedFollow = await prisma.userFollow.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    return res
      .status(200)
      .json({ message: "User unfollowed successfully.", deletedFollow });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
