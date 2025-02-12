"use client";

import useWebSocket from "../contexts/useWebSocket";

export default function WebSocketListener() {
  useWebSocket("ws://localhost:8080");
  return null;
}
