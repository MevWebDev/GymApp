import mqtt from "mqtt";
import fs from "fs";
import path from "path";

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

// Define the directory for log files
const LOG_DIR = path.join(__dirname, "logs");

// Create the logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const client = mqtt.connect("mqtt://localhost:1883");

// Handle MQTT connection
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  // Subscribe to the user/location topic
  client.subscribe("user/location", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to topic: user/location");
    }
  });
});

// Handle incoming MQTT messages
client.on("message", (topic, message) => {
  if (topic === "user/location") {
    try {
      // Parse the JSON message
      const data = JSON.parse(message.toString());

      // Ensure location data is valid
      if (data.latitude && data.longitude && data.timestamp) {
        // Prepare log file
        const logFile = path.join(LOG_DIR, `location_log_${Date.now()}.txt`);
        const date = formatDate(new Date(data.timestamp));
        const logContent = `Timestamp: ${date}\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\n\n`;

        // Write to log file
        fs.writeFileSync(logFile, logContent, { flag: "w" });
        console.log(`Location logged to ${logFile}`);
      } else {
        console.error("Invalid location data received:", data);
      }
    } catch (error) {
      console.error("Error processing MQTT message:", error);
    }
  }
});

// Handle MQTT connection errors
client.on("error", (err) => {
  console.error("MQTT Error:", err);
});
