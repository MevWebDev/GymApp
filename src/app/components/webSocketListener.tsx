"use client";

import useWebSocket from "../contexts/useWebSocket";

export default function WebSocketListener() {
  useWebSocket("wss://gymapp-backend-production-b174.up.railway.app");
  console.log("WebSocketListener");
  return null;
}
