import express from "express";
import exerciseRouter from "./routes/exercises";
import workoutRouter from "./routes/workouts";
import userRouter from "./routes/users";
import cors from "cors";
import updateGifUrls from "./scripts/updateGifs";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/exercises", exerciseRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

setInterval(async () => {
  const now = new Date();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  const targetHourUTC = 18;
  const targetMinuteUTC = 0;

  if (hours === targetHourUTC && minutes === targetMinuteUTC) {
    try {
      await updateGifUrls();
      console.log("GIF update job completed successfully.");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during GIF update job:", error.message);
      }
    }
  }
}, 60 * 1000);
