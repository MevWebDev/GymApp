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
const index_1 = require("../index");
const router = (0, express_1.Router)();
router.delete("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, workoutPlanId } = req.body;
    if (!userId || !workoutPlanId) {
        res.status(400).json({ error: "Missing userId or workoutPlanId." });
        return;
    }
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                savedWorkoutPlans: {
                    disconnect: { id: Number(workoutPlanId) },
                },
            },
            include: { savedWorkoutPlans: true },
        });
        res.status(200).json(updatedUser.savedWorkoutPlans);
    }
    catch (error) {
        console.error("Error unsaving workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, image, userId, exercises } = req.body;
        if (!title || !userId) {
            res.status(400).json({ error: "Title and userId are required." });
            return;
        }
        const workoutPlan = yield prisma_1.default.workoutPlan.create({
            data: {
                title,
                description,
                image,
                user: { connect: { id: userId } },
            },
        });
        if (Array.isArray(exercises) && exercises.length > 0) {
            yield prisma_1.default.workoutPlanExercise.createMany({
                data: exercises.map((exercise) => ({
                    workoutPlanId: workoutPlan.id,
                    exerciseId: exercise.exerciseId,
                    reps: exercise.reps,
                    sets: exercise.sets,
                })),
            });
        }
        const fullWorkoutPlan = yield prisma_1.default.workoutPlan.findUnique({
            where: { id: workoutPlan.id },
            include: {
                user: true,
                exercises: { include: { exercise: true } },
            },
        });
        res.status(201).json(fullWorkoutPlan);
        (0, index_1.sendWorkoutNotification)("💪 New workout available! Check it out.", String(workoutPlan.id));
    }
    catch (error) {
        console.error("Error creating workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        let workoutPlans;
        if (search) {
            workoutPlans = yield prisma_1.default.workoutPlan.findMany({
                where: {
                    title: { contains: String(search), mode: "insensitive" },
                },
                include: {
                    user: true,
                    exercises: { include: { exercise: true } },
                },
            });
        }
        else {
            workoutPlans = yield prisma_1.default.workoutPlan.findMany({
                include: {
                    user: true,
                    exercises: { include: { exercise: true } },
                },
                orderBy: { id: "desc" },
            });
        }
        res.json(workoutPlans);
    }
    catch (error) {
        console.error("Error fetching workout plans:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const workoutPlan = yield prisma_1.default.workoutPlan.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching workout plan by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, image, exercises } = req.body;
        const workoutPlan = yield prisma_1.default.workoutPlan.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                image,
            },
        });
        if (Array.isArray(exercises) && exercises.length > 0) {
            yield prisma_1.default.workoutPlanExercise.deleteMany({
                where: { workoutPlanId: workoutPlan.id },
            });
            yield prisma_1.default.workoutPlanExercise.createMany({
                data: exercises.map((exercise) => ({
                    workoutPlanId: workoutPlan.id,
                    exerciseId: exercise.exerciseId,
                    sets: exercise.sets,
                    reps: exercise.reps,
                })),
            });
        }
        const fullWorkoutPlan = yield prisma_1.default.workoutPlan.findUnique({
            where: { id: workoutPlan.id },
            include: {
                user: true,
                exercises: { include: { exercise: true } },
            },
        });
        res.json(fullWorkoutPlan);
    }
    catch (error) {
        console.error("Error updating workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.workoutPlanExercise.deleteMany({
            where: { workoutPlanId: Number(id) },
        });
        yield prisma_1.default.workoutPlan.delete({
            where: { id: Number(id) },
        });
        res.status(204).end();
    }
    catch (error) {
        console.error("Error deleting workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, workoutPlanId } = req.body;
    if (!userId || !workoutPlanId) {
        res.status(400).json({ error: "Missing userId or workoutPlanId." });
        return;
    }
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                savedWorkoutPlans: {
                    connect: { id: Number(workoutPlanId) },
                },
            },
            include: { savedWorkoutPlans: true },
        });
        res.status(200).json(updatedUser.savedWorkoutPlans);
    }
    catch (error) {
        console.error("Error saving workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/complete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, workoutPlanId, exercises } = req.body;
        const completedWorkout = yield prisma_1.default.completedWorkout.create({
            data: {
                user: { connect: { id: userId } },
                planId: Number(workoutPlanId),
                date: new Date(),
            },
        });
        const completedWorkoutExercises = yield prisma_1.default.completedWorkoutExercise.createMany({
            data: exercises.map((exercise) => ({
                reps: exercise.reps,
                weight: exercise.weight || 0,
                exerciseId: exercise.exerciseId,
                completedWorkoutId: completedWorkout.id,
            })),
        });
        res.status(201).json({
            completedWorkout,
            completedWorkoutExercises,
        });
    }
    catch (error) {
        console.error("Error starting workout plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
