import prisma from "../prisma/prisma"; // Adjust the path to your Prisma client
import axios from "axios";
import cron from "node-cron";

export default async function updateGifUrls() {
  console.log("Updating exercise GIF URLs...");
  try {
    // Step 1: Fetch exercises from the API
    const apiUrl = "https://exercisedb.p.rapidapi.com/exercises?limit=5000";
    const response = await axios.get(apiUrl, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // Replace with your actual API key
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    });

    const exercisesFromApi = response.data;

    for (const exercise of exercisesFromApi) {
      await prisma.exercise.update({
        where: {
          id: parseInt(exercise.id, 10),
        },
        data: {
          gifUrl: exercise.gifUrl,
        },
      });
    }

    console.log("Exercise GIF URLs updated successfully!");
  } catch (error) {
    console.error("Error updating GIF URLs:", error);
  } finally {
    await prisma.$disconnect(); // Close the Prisma connection
  }
}
