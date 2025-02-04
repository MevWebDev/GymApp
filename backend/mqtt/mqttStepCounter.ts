import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("📡 Connected to MQTT Broker");

  setInterval(() => {
    const steps = Math.floor(Math.random() * 3) + 1;
    client.publish("steps/counter", JSON.stringify({ steps }));
    console.log("🚶 Steps Sent:", steps);
  }, 2000);
});

client.on("error", (err) => {
  console.error("MQTT Connection Error:", err);
});
