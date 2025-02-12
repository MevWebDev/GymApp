import express from "express";
import exerciseRouter from "./routes/exercises";
import workoutRouter from "./routes/workouts";
import userRouter from "./routes/users";
import cors from "cors";
import updateGifUrls from "./scripts/updateGifs";

const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const usersOnline = new Set();

export function sendWorkoutNotification(message: string, id: string | number) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "workout-notification", message, id })
      );
    }
  });
}

function broadcastUserCount() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "users-online", count: usersOnline.size })
      );
    }
  });
}

wss.on("connection", (ws) => {
  console.log("New client connected");
  usersOnline.add(ws);
  broadcastUserCount();

  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    usersOnline.delete(ws);
    broadcastUserCount();
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/exercises", exerciseRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.listen(8080, () => {
  console.log("WebSocket server started on ws://localhost:8080");
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
