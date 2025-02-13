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
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function importExercises() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://exercisedb.p.rapidapi.com/exercises?limit=1000000", {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_KEY || "",
                    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
                },
            });
            const exercises = response.data;
            const created = yield prisma_1.default.exercise.createMany({
                data: exercises.map((ex) => ({
                    id: Number(ex.id),
                    bodyPart: ex.bodyPart,
                    equipment: ex.equipment,
                    gifUrl: ex.gifUrl,
                    name: ex.name,
                    target: ex.target,
                })),
                skipDuplicates: true,
            });
        }
        catch (error) {
            console.error("Błąd podczas importu ćwiczeń:", error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
importExercises();
