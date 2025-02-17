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
exports.sendWorkoutNotification = sendWorkoutNotification;
const express_1 = __importDefault(require("express"));
const exercises_1 = __importDefault(require("./routes/exercises"));
const workouts_1 = __importDefault(require("./routes/workouts"));
const users_1 = __importDefault(require("./routes/users"));
const cors_1 = __importDefault(require("cors"));
const updateGifs_1 = __importDefault(require("./scripts/updateGifs"));
const http = require("http");
const WebSocket = require("ws");
const app = (0, express_1.default)();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const usersOnline = new Set();
function sendWorkoutNotification(message, id) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "workout-notification", message, id }));
        }
    });
}
function broadcastUserCount() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "users-online", count: usersOnline.size }));
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
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/exercises", exercises_1.default);
app.use("/api/workouts", workouts_1.default);
app.use("/api/users", users_1.default);
// app.listen(process.env.PORT || 3001, () => {
//   console.log(`Server is running on port ${process.env.PORT || 3001}`);
// });
server.listen(process.env.PORT, () => {
    console.log(`WebSocket server started on ws://localhost:${process.env.PORT || 8080}`);
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const targetHourUTC = 18;
    const targetMinuteUTC = 0;
    if (hours === targetHourUTC && minutes === targetMinuteUTC) {
        try {
            yield (0, updateGifs_1.default)();
            console.log("GIF update job completed successfully.");
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error during GIF update job:", error.message);
            }
        }
    }
}), 60 * 1000);
