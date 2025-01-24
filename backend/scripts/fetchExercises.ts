import axios from "axios";
import prisma from "../prisma/prisma"; // ścieżka do Twojego klienta Prisma
import { Exercise } from "../../src/app/types";

async function importExercises() {
  try {
    // 1. Pobierz dane z API
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises?limit=1000000",
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    // Zakładamy, że w `response.data` mamy tablicę obiektów
    const exercises = response.data;

    console.log(`Pobrano ćwiczeń: ${exercises.length}`);

    // 2. Zapis do bazy (createMany) z pominięciem duplikatów
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
    console.log(`Zapisano ćwiczeń: ${created.count}`);
  } catch (error) {
    console.error("Błąd podczas importu ćwiczeń:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importExercises();
