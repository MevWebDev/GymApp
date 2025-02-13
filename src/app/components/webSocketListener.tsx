"use client";

import useWebSocket from "../contexts/useWebSocket";

export default function WebSocketListener() {
  useWebSocket("wss://gymapp-backend-production.up.railway.app");
  return null;
}
