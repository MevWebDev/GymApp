import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {};

    ws.current.onmessage = async (event) => {
      let message;

      if (event.data instanceof Blob) {
        message = await event.data.text();
      } else {
        message = event.data;
      }

      try {
        const data = JSON.parse(message);

        if (data.type === "workout-notification") {
          alert(`🔔 ${data.message}`);
        } else if (data.type === "users-online") {
          setOnlineUsers(data.count);
        }
      } catch {
        setMessages((prev) => [...prev, message]);
      }
    };

    ws.current.onclose = () => {};

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return { messages, sendMessage, onlineUsers };
};

export default useWebSocket;
