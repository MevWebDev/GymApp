import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";
import { supabase } from "../auth/supabaseClient";

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
  } catch {}
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
  } catch {
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
    const { id, nick, email, password, avatar } = req.body;

    const user = await prisma.user.create({
      data: {
        id,
        nick,
        email,
        password,
        avatar,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/update", async (req, res) => {
  const { id, nick, avatar } = req.body;

  if (!id) {
    return void res.status(400).json({ error: "User id is required." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        nick,
        avatar,
      },
    });
    return void res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return void res
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

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return void res.status(400).json({ error: "Missing email or password." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      return void res.status(400).json({ error: error.message });
    }

    console.log("User logged in successfully.");
    return void res.status(200).json(data);
  } catch (error) {
    console.error("Error logging in user:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return void res.status(400).json({ error: "Missing email or password." });
  }

  try {
    await supabase.auth.signUp({
      email: email,
      password: password,
    });

    return void res.status(200);
  } catch (error) {
    console.error("Error registering user:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/login/google", async (req: Request, res: Response) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "http://localhost:3000/" },
  });
  if (error) {
    return void res.status(500).json({ error: "Internal server error" });
  }
  return void res.status(200);
});

router.delete("/unfollow", async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return void res
      .status(400)
      .json({ error: "Missing userId or followerId." });
  }

  try {
    const deletedFollow = await prisma.userFollow.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    return void res
      .status(200)
      .json({ message: "User unfollowed successfully.", deletedFollow });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
