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

export default router;
