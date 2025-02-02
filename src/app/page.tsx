"use client";
import { Container } from "@mui/material";
import Auth from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth={false} sx={{ bgcolor: "secondary.main" }}>
      {user ? <h1>Welcome, {user.nick}!</h1> : <Auth />}
    </Container>
  );
}
