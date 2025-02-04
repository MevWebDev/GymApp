"use client";
import { Container } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import client from "./utils/mqttClient";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Chat from "./components/Chat";

export default function Home() {
  const { user } = useAuth();
  const [steps, setSteps] = useState(0);
  const [counting, setCounting] = useState(false);
  const [location, setLocation] = useState(null);

  // Function to get the user's location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const handleCounting = () => {
    setCounting(true);
  };

  useEffect(() => {
    const handleMessage = (topic, message) => {
      if (topic === "steps/counter" && counting) {
        const data = JSON.parse(message.toString());
        setSteps((prev) => prev + data.steps);
      }
    };

    if (counting) {
      console.log("Subscribing to MQTT topic: steps/counter");
      client.subscribe("steps/counter");
      client.on("message", handleMessage);
    } else {
      console.log("Unsubscribing from MQTT topic: steps/counter");
      client.unsubscribe("steps/counter");
    }

    return () => {
      client.removeListener("message", handleMessage);
    };
  }, [counting]); // Depend on counting

  const stopCounting = () => {
    setCounting(false);

    const payload = JSON.stringify({ steps, timestamp: Date.now() });

    client.publish("steps/save", payload, { qos: 1 }, (err) => {
      if (err) {
        console.error("Error saving steps:", err);
      } else {
        console.log("Steps saved successfully!");
        setSteps(0);
      }
    });
  };

  const sendLocationToMQTT = (location) => {
    if (location) {
      const payload = JSON.stringify(location);
      client.publish("user/location", payload, { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing location:", err);
        } else {
          console.log("Location sent:", location);
        }
      });
    }
  };

  useEffect(() => {
    // Get location and send it to MQTT when the component mounts
    getLocation()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude,
          longitude,
          timestamp: Date.now(),
        };
        setLocation(locationData);
        sendLocationToMQTT(locationData); // Send location to MQTT
      })
      .catch((error) => {
        console.error("Error getting location:", error);
      });
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <Container maxWidth={false} sx={{ bgcolor: "secondary.main" }}>
      {user ? <h1>Welcome, {user.nick}!</h1> : null}
      <Button color="success" onClick={handleCounting} disabled={counting}>
        Start counting steps
      </Button>
      <Button color="error" onClick={stopCounting}>
        Save Steps
      </Button>
      <h2>Step Count: {steps}</h2>

      {location && (
        <div>
          <h3>Your Location:</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      <Chat />
    </Container>
  );
}
