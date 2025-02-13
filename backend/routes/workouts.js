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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prisma_1 = require("../prisma/prisma");
var index_1 = require("../index");
var router = (0, express_1.Router)();
router.delete("/save", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, workoutPlanId, updatedUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, workoutPlanId = _a.workoutPlanId;
                if (!userId || !workoutPlanId) {
                    res.status(400).json({ error: "Missing userId or workoutPlanId." });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.user.update({
                        where: { id: userId },
                        data: {
                            savedWorkoutPlans: {
                                disconnect: { id: Number(workoutPlanId) },
                            },
                        },
                        include: { savedWorkoutPlans: true },
                    })];
            case 2:
                updatedUser = _b.sent();
                res.status(200).json(updatedUser.savedWorkoutPlans);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error("Error unsaving workout plan:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, image, userId, exercises, workoutPlan_1, fullWorkoutPlan, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, title = _a.title, description = _a.description, image = _a.image, userId = _a.userId, exercises = _a.exercises;
                if (!title || !userId) {
                    res.status(400).json({ error: "Title and userId are required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma_1.default.workoutPlan.create({
                        data: {
                            title: title,
                            description: description,
                            image: image,
                            user: { connect: { id: userId } },
                        },
                    })];
            case 1:
                workoutPlan_1 = _b.sent();
                if (!(Array.isArray(exercises) && exercises.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.default.workoutPlanExercise.createMany({
                        data: exercises.map(function (exercise) { return ({
                            workoutPlanId: workoutPlan_1.id,
                            exerciseId: exercise.exerciseId,
                            reps: exercise.reps,
                            sets: exercise.sets,
                        }); }),
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, prisma_1.default.workoutPlan.findUnique({
                    where: { id: workoutPlan_1.id },
                    include: {
                        user: true,
                        exercises: { include: { exercise: true } },
                    },
                })];
            case 4:
                fullWorkoutPlan = _b.sent();
                res.status(201).json(fullWorkoutPlan);
                (0, index_1.sendWorkoutNotification)("💪 New workout available! Check it out.", String(workoutPlan_1.id));
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Error creating workout plan:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, workoutPlans, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                search = req.query.search;
                workoutPlans = void 0;
                if (!search) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma_1.default.workoutPlan.findMany({
                        where: {
                            title: { contains: String(search), mode: "insensitive" },
                        },
                        include: {
                            user: true,
                            exercises: { include: { exercise: true } },
                        },
                    })];
            case 1:
                workoutPlans = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, prisma_1.default.workoutPlan.findMany({
                    include: {
                        user: true,
                        exercises: { include: { exercise: true } },
                    },
                    orderBy: { id: "desc" },
                })];
            case 3:
                workoutPlans = _a.sent();
                _a.label = 4;
            case 4:
                res.json(workoutPlans);
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error("Error fetching workout plans:", error_3);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, workoutPlan, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.findUnique({
                        where: { id: Number(id) },
                        include: {
                            user: true,
                            exercises: { include: { exercise: true } },
                        },
                    })];
            case 1:
                workoutPlan = _a.sent();
                if (!workoutPlan) {
                    res.status(404).json({ error: "Workout plan not found" });
                    return [2 /*return*/];
                }
                res.json(workoutPlan);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching workout plan by ID:", error_4);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, image, exercises, workoutPlan_2, fullWorkoutPlan, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, image = _a.image, exercises = _a.exercises;
                return [4 /*yield*/, prisma_1.default.workoutPlan.update({
                        where: { id: Number(id) },
                        data: {
                            title: title,
                            description: description,
                            image: image,
                        },
                    })];
            case 1:
                workoutPlan_2 = _b.sent();
                if (!(Array.isArray(exercises) && exercises.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma_1.default.workoutPlanExercise.deleteMany({
                        where: { workoutPlanId: workoutPlan_2.id },
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, prisma_1.default.workoutPlanExercise.createMany({
                        data: exercises.map(function (exercise) { return ({
                            workoutPlanId: workoutPlan_2.id,
                            exerciseId: exercise.exerciseId,
                            sets: exercise.sets,
                            reps: exercise.reps,
                        }); }),
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, prisma_1.default.workoutPlan.findUnique({
                    where: { id: workoutPlan_2.id },
                    include: {
                        user: true,
                        exercises: { include: { exercise: true } },
                    },
                })];
            case 5:
                fullWorkoutPlan = _b.sent();
                res.json(fullWorkoutPlan);
                return [3 /*break*/, 7];
            case 6:
                error_5 = _b.sent();
                console.error("Error updating workout plan:", error_5);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma_1.default.workoutPlanExercise.deleteMany({
                        where: { workoutPlanId: Number(id) },
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, prisma_1.default.workoutPlan.delete({
                        where: { id: Number(id) },
                    })];
            case 2:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error("Error deleting workout plan:", error_6);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/save", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, workoutPlanId, updatedUser, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, workoutPlanId = _a.workoutPlanId;
                if (!userId || !workoutPlanId) {
                    res.status(400).json({ error: "Missing userId or workoutPlanId." });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.user.update({
                        where: { id: userId },
                        data: {
                            savedWorkoutPlans: {
                                connect: { id: Number(workoutPlanId) },
                            },
                        },
                        include: { savedWorkoutPlans: true },
                    })];
            case 2:
                updatedUser = _b.sent();
                res.status(200).json(updatedUser.savedWorkoutPlans);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                console.error("Error saving workout plan:", error_7);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/complete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, workoutPlanId, exercises, completedWorkout_1, completedWorkoutExercises, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, userId = _a.userId, workoutPlanId = _a.workoutPlanId, exercises = _a.exercises;
                return [4 /*yield*/, prisma_1.default.completedWorkout.create({
                        data: {
                            user: { connect: { id: userId } },
                            planId: Number(workoutPlanId),
                            date: new Date(),
                        },
                    })];
            case 1:
                completedWorkout_1 = _b.sent();
                return [4 /*yield*/, prisma_1.default.completedWorkoutExercise.createMany({
                        data: exercises.map(function (exercise) { return ({
                            reps: exercise.reps,
                            weight: exercise.weight || 0,
                            exerciseId: exercise.exerciseId,
                            completedWorkoutId: completedWorkout_1.id,
                        }); }),
                    })];
            case 2:
                completedWorkoutExercises = _b.sent();
                res.status(201).json({
                    completedWorkout: completedWorkout_1,
                    completedWorkoutExercises: completedWorkoutExercises,
                });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _b.sent();
                console.error("Error starting workout plan:", error_8);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
