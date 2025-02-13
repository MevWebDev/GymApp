"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma/prisma"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        if (search) {
            const users = yield prisma_1.default.user.findMany({
                where: {
                    nick: { contains: String(search), mode: "insensitive" },
                },
                orderBy: { nick: "asc" },
            });
            res.json(users);
            return;
        }
        const allUsers = yield prisma_1.default.user.findMany({});
        res.json(allUsers);
    }
    catch (_a) { }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma_1.default.user.findUnique({
            where: { id: id },
        });
        const followers = yield prisma_1.default.userFollow.findMany({
            where: { followingId: id },
            include: { follower: true },
        });
        const following = yield prisma_1.default.userFollow.findMany({
            where: { followerId: id },
            include: { following: true },
        });
        if (!user || !followers || !following) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const completeUser = Object.assign(Object.assign({}, user), { followers,
            following });
        res.json(completeUser);
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/:id/workouts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const workoutPlans = yield prisma_1.default.workoutPlan.findMany({
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
    }
    catch (error) {
        console.error("Error fetching user workouts by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, nick, email, password, avatar } = req.body;
        const user = yield prisma_1.default.user.create({
            data: {
                id,
                nick,
                email,
                password,
                avatar,
            },
        });
        res.json(user);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.patch("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, nick, avatar } = req.body;
    if (!id) {
        return void res.status(400).json({ error: "User id is required." });
    }
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: id },
            data: {
                nick,
                avatar,
            },
        });
        return void res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return void res
            .status(500)
            .json({ error: "An error occurred while updating the profile." });
    }
}));
router.get("/:userId/saved-workouts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userWithSaved = yield prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching saved workouts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/follow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) {
        res.status(400).json({ error: "Missing followerId or followingId." });
        return;
    }
    try {
        const userFollow = yield prisma_1.default.userFollow.create({
            data: {
                followerId,
                followingId,
            },
        });
        res.status(200).json(userFollow);
    }
    catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/unfollow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) {
        return void res
            .status(400)
            .json({ error: "Missing userId or followerId." });
    }
    try {
        const deletedFollow = yield prisma_1.default.userFollow.deleteMany({
            where: {
                followerId: followerId,
                followingId: followingId,
            },
        });
        return void res
            .status(200)
            .json({ message: "User unfollowed successfully.", deletedFollow });
    }
    catch (error) {
        console.error("Error unfollowing user:", error);
        return void res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
