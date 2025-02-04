// components/Chat.tsx
import { useState } from "react";
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import useWebSocket from "../contexts/useWebSocket";
import { useAuth } from "../contexts/AuthContext";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { messages, sendMessage, onlineUsers } = useWebSocket(
    "ws://localhost:8080"
  );
  const { user } = useAuth();

  console.log("Chat component re-rendered, messages:", messages);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(`${user?.nick}: ${inputMessage}`);
      setInputMessage("");
    }
  };

  if (!user) return;

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      {isOpen ? (
        <Paper sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Chat</Typography>
          <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
            <Typography variant="body2">Users Online: {onlineUsers}</Typography>
            {messages.map((msg, index) => (
              <Box key={index}>
                <Typography>{msg}</Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </Paper>
      ) : (
        <IconButton color="primary" onClick={() => setIsOpen(true)}>
          <ChatIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Chat;
