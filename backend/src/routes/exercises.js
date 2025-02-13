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
        let exercises;
        if (search) {
            exercises = yield prisma_1.default.exercise.findMany({
                where: {
                    OR: [
                        { name: { contains: String(search), mode: "insensitive" } },
                        { bodyPart: { contains: String(search), mode: "insensitive" } },
                        { target: { contains: String(search), mode: "insensitive" } },
                    ],
                },
                orderBy: { name: "asc" },
            });
        }
        else {
            exercises = yield prisma_1.default.exercise.findMany({
                orderBy: { name: "asc" },
            });
        }
        if (exercises.length === 0) {
            console.warn("No exercises found, using fallback data.");
            return;
        }
        res.json(exercises);
    }
    catch (error) {
        console.error("Error fetching exercises, returning backup data:", error);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exercise = yield prisma_1.default.exercise.findUnique({
            where: { id: Number(id) },
        });
        if (!exercise) {
            res.status(404).json({ error: "Exercise not found" });
            return;
        }
        res.json(exercise);
    }
    catch (error) {
        console.error("Error fetching exercise by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
