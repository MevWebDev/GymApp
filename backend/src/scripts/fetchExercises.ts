import axios from "axios";
import prisma from "../prisma/prisma";
import { Exercise } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

async function importExercises() {
  try {
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises?limit=1000000",
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_KEY || "",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    const exercises = response.data;

    const created = await prisma.exercise.createMany({
      data: exercises.map((ex: Exercise) => ({
        id: Number(ex.id),
        bodyPart: ex.bodyPart,
        equipment: ex.equipment,
        gifUrl: ex.gifUrl,
        name: ex.name,
        target: ex.target,
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Błąd podczas importu ćwiczeń:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importExercises();
