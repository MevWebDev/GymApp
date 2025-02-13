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
exports.default = updateGifUrls;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function updateGifUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Updating exercise GIF URLs...");
        try {
            const apiUrl = "https://exercisedb.p.rapidapi.com/exercises?limit=5000";
            const response = yield axios_1.default.get(apiUrl, {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
                    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
                },
            });
            const exercisesFromApi = response.data;
            for (const exercise of exercisesFromApi) {
                yield prisma_1.default.exercise.update({
                    where: {
                        id: parseInt(exercise.id, 10),
                    },
                    data: {
                        gifUrl: exercise.gifUrl,
                    },
                });
            }
            console.log("Exercise GIF URLs updated successfully!");
        }
        catch (error) {
            console.error("Error updating GIF URLs:", error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
updateGifUrls();
