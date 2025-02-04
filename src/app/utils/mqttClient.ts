import mqtt from "mqtt";

const options = {
  protocol: "ws",
  host: "localhost",
  port: 1884,
};

const client = mqtt.connect(`ws://${options.host}:${options.port}`);

client.on("connect", () => {
  console.log("✅ Connected to MQTT WebSocket!");
  client.subscribe("steps/counter", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("📡 Subscribed to topic: steps");
    }
  });
});

export default client;
