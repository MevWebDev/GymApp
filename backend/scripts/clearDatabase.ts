import prisma from "../prisma/prisma";

async function clearDatabase() {
  try {
    // Usuń wszystkie dane z tabeli Exercise
    await prisma.exercise.deleteMany();
    console.log("Wyczyszczono tabelę Exercise.");
  } catch (error) {
    console.error("Błąd podczas czyszczenia bazy:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
