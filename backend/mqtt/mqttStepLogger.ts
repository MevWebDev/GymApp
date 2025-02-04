import mqtt from "mqtt";
import fs from "fs";
import path, { format } from "path";

const LOG_DIR = path.join(__dirname, "logs");

function formatDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}, ${month} ${date.getDate()}, ${year} ${hours}:${minutes}:${seconds}`;
}

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const client = mqtt.connect("mqtt://localhost:1883"); // Adjust if needed

client.on("connect", () => {
  console.log("Connected to MQTT broker step logger");
  client.subscribe("steps/save", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to topic: steps/save");
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "steps/save") {
    try {
      const data = JSON.parse(message.toString());
      const logFile = path.join(LOG_DIR, `steps_log_${Date.now()}.txt`);
      const date = formatDate(new Date(data.timestamp));
      const logContent = `Date: ${date}\nSteps: ${data.steps}\n\n`;

      fs.writeFileSync(logFile, logContent, { flag: "w" });
      console.log(`Step count logged to ${logFile}`);
    } catch (error) {
      console.error("Error processing MQTT message:", error);
    }
  }
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});
